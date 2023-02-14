import { Balance } from '@bloom-trade/finance-connector/dist/@types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { cryptoWalletServices } from '../services/cryptoWallet.services';
import { CryptoWallet } from '../type';
import { UserStore } from '../store/user.store';
import { showAlert } from '../components/alert/handler';
import { authService } from '../services/auth.services';
import { Wallet } from '@bloom-trade/types';

export default function useWallets(userId: string) {
  const STABLES = ['USDC', 'USDT', 'DAI'];
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState<{
    wallets: boolean;
    balances: boolean;
  }>({ wallets: true, balances: true });
  const [isRefreshingWallet, setIsRefreshingWallet] = useState<{
    id: string;
  }>();
  const circleApiKey = UserStore.useState((s) => s.circleApiKey);

  /**
   * It creates a new crypto wallet.
   * @param wallet - Partial<CryptoWallet>
   */
  const createNewCryptoWallet = async (wallet: Partial<CryptoWallet>) => {
    setLoading({ wallets: true, balances: true });
    await cryptoWalletServices.save(wallet);
  };

  /**
   * It refreshes the balance of a wallet
   * @param {Wallet} wallet - Wallet
   */
  const refreshOneWallet = async (wallet: Wallet) => {
    setIsRefreshingWallet({ id: wallet.id });
    if (wallet.brand === 'circle') {
      //TODO: implement circle wallet refresh
      const provider = {
        type: 'circle',
        auth: {
          apiKey: circleApiKey,
        },
      };
      const {
        data: { balance: balances },
      } = await axios.post<{ balance: Balance }>('/api/wallets/balance', {
        providers: [provider],
      });
      const circleBalance = balances.filter((balance) =>
        STABLES.includes(balance.asset.toUpperCase())
      )[0];
      if (circleBalance.balance !== wallet.balance.amount) {
        //Balance is different => update wallet
        let details: any[] = [];
        circleBalance.detail.forEach((d) => {
          details.push({
            ...d,
            currency: circleBalance.asset,
          });
          let newWalletBalance = {
            ...wallet,
          };
          newWalletBalance.balance.amount = circleBalance.balance;
          newWalletBalance.balance.detail = details;
          const index = wallets.findIndex((w) => w.id === wallet.id);
          const newWallets = [...wallets];
          newWallets[index] = newWalletBalance;
          setWallets(newWallets);
          showAlert('Balance actualizado', 'success');
        });
      } else {
        //Balance is the same => do nothing
        showAlert('No hay cambios en el balance de esa billetera', 'info');
      }
    } else {
      const address = wallet.address;
      const {
        data: { balance: balances },
      } = await axios.post<{ balance: Balance }>('/api/wallets/balance', {
        addresses: [address],
      });
      const stableCoinsBalances = balances.filter((balance) =>
        STABLES.includes(balance.asset.toUpperCase())
      );
      //Proceso si y solo si los balances son distintos =>
      let totalBalance = '0';
      let details: any[] = [];
      stableCoinsBalances.forEach(({ balance, detail, asset }) => {
        totalBalance = (
          parseFloat(balance).toFixed(3) + parseFloat(totalBalance).toFixed(3)
        ).toString();

        detail.forEach((d) => {
          details.push({
            ...d,
            currency: asset,
          });
        });
      });
      if (totalBalance !== wallet.balance.amount) {
        //Hay que procesar el cambio
        const newWalletBalance = {
          ...wallet,
        };
        newWalletBalance.balance.amount = totalBalance;
        newWalletBalance.balance.detail = details;
        const index = wallets.findIndex((w) => w.id === wallet.id);
        const newWallets = [...wallets];
        newWallets[index] = newWalletBalance;
        setWallets(newWallets);
        showAlert('Balance actualizado', 'success');
      } else {
        showAlert('No hay cambios en el balance de esa billetera', 'info');
      }
    }
    setIsRefreshingWallet(undefined);
  };

  const loadWallets = async () => {
    setLoading({ wallets: true, balances: true });
    const wallets = await cryptoWalletServices.getWalletsByUserId(userId);
    let addresses: string[] = [];
    let providers: {
      type: 'circle' | 'binance' | 'coinbase';
      auth: {
        apiKey?: string;
        apiSecret?: string;
      };
    }[] = [];
    const processedWallets: Wallet[] = [];
    if (wallets.length <= 0) {
      setLoading({
        wallets: false,
        balances: false,
      });
      return;
    }
    for (const wallet of wallets) {
      processedWallets.push({
        ...wallet,
        balance: {
          amount: '-1',
          detail: [],
        },
      });
      if (wallet.brand === 'circle') {
        providers.push({
          type: 'circle',
          auth: {
            apiKey: circleApiKey,
          },
        });
      } else {
        addresses.push(wallet.address);
      }
    }
    setWallets(processedWallets);
    setLoading({
      ...loading,
      wallets: false,
    });
    const {
      data: { balance: balances },
    } = await axios.post<{ balance: Balance }>(
      '/api/wallets/balance',
      {
        addresses,
        providers,
      },
      {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );
    if (balances.length > 0) {
      const stableCoinsBalances = balances.filter((balance) =>
        STABLES.includes(balance.asset.toUpperCase())
      );
      stableCoinsBalances.forEach((balance) => {
        balance.detail.forEach((detail) => {
          if (detail.balance === '0') return;
          if (detail.provider === 'circle') {
            const index = processedWallets.findIndex(
              (wallet) => wallet.brand === 'circle'
            );
            processedWallets[index].balance.amount = detail.balance;
            processedWallets[index].balance.detail.push({
              ...detail,
              currency: balance.asset,
            });
            return;
          }
          const index = processedWallets.findIndex(
            (wallet) => wallet.address === detail.address
          );
          if (index === -1) return;
          processedWallets[index].balance.amount = (
            parseFloat(detail.balance).toFixed(3) +
            (processedWallets[index].balance.amount === '-1'
              ? 0
              : parseFloat(processedWallets[index].balance.amount).toFixed(3))
          ).toString();

          processedWallets[index].balance.detail.push({
            ...detail,
            currency: balance.asset,
          });
        });
      });
    }

    //Check if any wallet is with -1 balance
    const filteredWallets = processedWallets.filter(
      (wallet) => wallet.balance.amount === '-1'
    );
    if (filteredWallets.length > 0) {
      filteredWallets.forEach((wallet) => {
        processedWallets[
          processedWallets.findIndex((w) => w.id === wallet.id)
        ].balance.amount = '0';
      });
    }
    setWallets(processedWallets);
    setLoading({
      wallets: false,
      balances: false,
    });
  };

  useEffect(() => {
    (async () => {
      if (wallets.length <= 0) {
        await loadWallets();
      }
    })();
  }, []);

  return {
    wallets,
    loading,
    loadWallets,
    refreshOneWallet,
    isRefreshingWallet,
    createNewCryptoWallet,
  };
}
