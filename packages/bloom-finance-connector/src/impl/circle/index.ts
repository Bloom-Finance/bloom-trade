import { ProviderConnector } from '../connector';
import { IProviderConnector, ProviderCredentials } from '../../@types/index';
import axios, { AxiosError } from 'axios';
import { Circle, CircleEnvironments } from '@circle-fin/circle-sdk';
import { Chain, Provider, Transaction } from '@bloom-trade/types';
import { fDate, stringToMilisecondsDate } from '../../utils';
interface CircleBalance {
  available: Array<{ amount: string; currency: string }>;
  unsettled: Array<{ amount: string; currency: string }>;
}
interface CircleWallets {
  address: string;
  currency: string;
  chain: string;
}
export class ProviderConnectorImpl
  extends ProviderConnector
  implements IProviderConnector
{
  async getBalance(): Promise<
    {
      asset: string;
      balance: string;
      description: string;
      detail: {
        address: string;
        provider: string;
        chain: string;
        balance: string;
      }[];
    }[]
  > {
    try {
      const balance: {
        asset: string;
        balance: string;
        description: string;
        detail: {
          address: string;
          provider: string;
          chain: string;
          balance: string;
        }[];
      }[] = [];
      const {
        data: { data: res },
      } = await axios.get<{ data: CircleBalance }>(
        `${this._baseurl}/balances`,
        {
          headers: {
            Authorization: `Bearer ${this._provider.auth.apiKey}`,
          },
        }
      );
      const {
        data: { data: wallets },
      } = await axios.get<{ data: CircleWallets[] }>(
        `${this._baseurl}/businessAccount/wallets/addresses/deposit`,
        {
          headers: {
            Authorization: `Bearer ${this._provider.auth.apiKey}`,
          },
        }
      );
      const processedWallets: {
        address: string;
        chain: string;
        balance: string;
        provider: string;
      }[] = [];
      wallets.forEach((wallet) => {
        processedWallets.push({
          address: wallet.address,
          chain: wallet.chain,
          balance:
            res.available.find((item) => item.currency === wallet.currency)
              ?.amount || '0',
          provider: 'circle',
        });
      });
      res.available.forEach((item) => {
        balance.push({
          asset: item.currency === 'USD' ? 'USDC' : item.currency,
          balance: item.amount,
          description: 'Available balance',
          detail: processedWallets,
        });
      });
      return balance;
    } catch (error) {
      if (!(error instanceof AxiosError)) throw new Error('Unknown error');
      const axiosError = error as AxiosError<{ code: number; message: string }>;
      const { response } = axiosError;
      throw new Error(response?.data.message || 'Unknown error');
    }
  }
  async getTransactionHistory(filters: {
    from:
      | 'beginning'
      | {
          selfCustodialProviders?: {
            chain: Chain;
            block: number;
          }[];
          custodialProviders?: {
            id: Provider;
            block?: number;
            date: number; //NOT IN UNIX TIMESTAMP
          }[];
        };
    order?: 'asc' | 'desc';
    filters?: {
      onlyStables?: boolean;
    };
  }) {
    let startingDate = 0;
    if (
      filters.from !== 'beginning' &&
      filters.from.custodialProviders &&
      filters.from.custodialProviders.length > 0
    ) {
      const foundProvider = filters.from.custodialProviders.find(
        (provider) => provider.id === 'circle'
      );
      if (!foundProvider) return;
      startingDate = foundProvider.date;
    }
    const circleSDK = new Circle(
      this._provider.auth.apiKey as string,
      this._provider.useTestnet
        ? CircleEnvironments.sandbox
        : CircleEnvironments.production
    );
    const {
      data: { data: transfers },
    } = await circleSDK.transfers.listTransfers(
      undefined,
      undefined,
      undefined,
      undefined,
      fDate(startingDate),
      fDate(Date.now())
    );
    const declaredCircleAddresses: {
      address: string;
      chains: Chain[];
    }[] = [];
    const {
      data: { data: wallets },
    } = await circleSDK.wallets.listWallets();
    if (wallets && wallets.length > 0) {
      for (const wallet of wallets) {
        if (!wallet.walletId) return;
        const {
          data: { data: addresses },
        } = await circleSDK.wallets.listAddresses(wallet.walletId);
        if (addresses && addresses.length > 0) {
          for (const address of addresses) {
            if (!address.address) continue;
            if (
              declaredCircleAddresses.filter(
                (addr) => address.address === addr.address
              ).length === 0 &&
              address.chain
            )
              declaredCircleAddresses.push({
                address: address.address,
                chains: [address.chain.toLowerCase() as Chain],
              });
            else {
              if (!address.chain) continue;
              const index = declaredCircleAddresses.findIndex(
                (addr) => addr.address === address.address
              );
              declaredCircleAddresses[index] = {
                ...declaredCircleAddresses[index],
                chains: [
                  ...declaredCircleAddresses[index].chains,
                  address.chain.toLowerCase() as Chain,
                ],
              };
            }
          }
        }
      }
    }
    const transactions: Transaction[] = [];
    if (transfers && transfers.length > 0) {
      transfers.forEach((transfer) => {
        if (transfer.amount.currency !== 'USD') return;
        const foundAddress = declaredCircleAddresses.find(
          (address) => address.address === transfer.destination.address
        );
        transactions.push({
          asset: 'usdc',
          amount: transfer.amount.amount,
          from: `circle_${transfer.source.type}_${
            transfer.source.type === 'blockchain'
              ? (transfer.source as any).chain.toLowerCase()
              : transfer.source.identities
              ? transfer.source.identities[0].type
              : (transfer.source as any).id
          }`,
          status:
            transfer.status === 'complete' ? 'completed' : transfer.status,
          to: transfer.destination.address || transfer.destination.type,
          type: foundAddress !== undefined ? 'in' : 'out',
          timestamp: transfer.createDate
            ? stringToMilisecondsDate(transfer.createDate)
            : Date.now(),
          provider: 'circle',
        });
      });
    }
    return transactions;
  }
}
