import { Balance } from '@bloom-trade/positions-connector/dist/@types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { cryptoWalletServices } from '../services/cryptoWallet.services';
import { CryptoWallet } from '../type';
import { UserStore } from '../store/user.store';
import { showAlert } from '../components/alert/handler';

interface Wallet extends CryptoWallet {
  balance: {
    amount: string;
    detail: {
      address?: string;
      balance?: string;
      chain?: string;
      provider: string;
      currency: string;
    }[];
  };
}

export default function useWallets(userId: string) {
  const STABLES = ['USDC', 'USDT', 'DAI'];
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState<{
    wallets: boolean;
    balances: boolean;
  }>({ wallets: true, balances: true });
  const [isRefreshingWallet, setIsRefreshingWallet] =
    useState<{
      id: string;
    }>();
  const circleApiKey = UserStore.useState((s) => s.circleApiKey);
  const sum = (a: any, b: any, positions: number) => {
    const factor = Math.pow(10, positions);
    return (
      (a.toFixed(positions) * factor + b.toFixed(positions) * factor) / factor
    );
  };
  const createNewCryptoWallet = async (wallet: Partial<CryptoWallet>) => {
    setLoading({ wallets: true, balances: true });
    await cryptoWalletServices.save(wallet);
  };
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
      } = await axios.post<{ balance: Balance }>('/api/wallets/getBalances', {
        providers: [provider],
      });
      const circleBalance = balances.filter((balance) =>
        STABLES.includes(balance.asset)
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
      } = await axios.post<{ balance: Balance }>('/api/wallets/getBalances', {
        addresses: [address],
      });
      const stableCoinsBalances = balances.filter((balance) =>
        STABLES.includes(balance.asset)
      );
      //Proceso si y solo si los balances son distintos =>
      let totalBalance = '0';
      let details: any[] = [];
      stableCoinsBalances.forEach(({ balance, detail, asset }) => {
        totalBalance = sum(
          parseFloat(balance),
          parseFloat(totalBalance),
          3
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
    } = await axios.post<{ balance: Balance }>('/api/wallets/getBalances', {
      addresses,
      providers,
    });

    const stableCoinsBalances = balances.filter((balance) =>
      STABLES.includes(balance.asset)
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
        processedWallets[index].balance.amount = sum(
          parseFloat(detail.balance),
          parseFloat(processedWallets[index].balance.amount),
          3
        ).toString();
        processedWallets[index].balance.detail.push({
          ...detail,
          currency: balance.asset,
        });
      });
    });
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
