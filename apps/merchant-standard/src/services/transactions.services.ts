import { BloomError, Chain, Provider, Transaction } from '@bloom-trade/types';
import { errorHandler } from '@bloom-trade/utilities';
import axios, { AxiosError } from 'axios';
import { showAlert } from '../components/alert/handler';
import { authService } from './auth.services';
import { cryptoWalletServices } from './cryptoWallet.services';

interface ITransactionsServices {
  getTransactions(params?: {
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
    circleApiKey?: string;
    order?: 'asc' | 'desc';
  }): Promise<{
    data?: Transaction[];
    error?: BloomError<AxiosError>;
  }>;
}
class TransactionsServices implements ITransactionsServices {
  async getTransactions(params?: {
    from?:
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
    circleApiKey?: string;
    order?: 'asc' | 'desc';
  }): Promise<{
    data?: Transaction[] | undefined;
    error?: BloomError<AxiosError<unknown, any>> | undefined;
  }> {
    try {
      const token = authService.getToken();
      const user = await authService.getUserSession();
      if (!token || !user)
        return { error: errorHandler('No valid token', showAlert) };
      const wallets = await cryptoWalletServices.getWalletsByUserId(
        user?.userId
      );
      let addresses: string[] = [];
      let providers: {
        type: 'circle' | 'binance' | 'coinbase';
        auth: {
          apiKey?: string;
          apiSecret?: string;
        };
      }[] = [];
      if (wallets.length <= 0) {
        return {
          error: errorHandler('No wallets found', showAlert),
        };
      }
      for (const wallet of wallets) {
        if (wallet.brand === 'circle' && params && params.circleApiKey) {
          providers.push({
            type: 'circle',
            auth: {
              apiKey: params.circleApiKey,
            },
          });
        } else {
          addresses.push(wallet.address);
        }
      }
      const { data: res } = await axios.post<{ transactions: Transaction[] }>(
        '/api/transactions',
        {
          addresses,
          providers,
          filterParams: {
            from: params?.from,
          },
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        data: res.transactions,
      };
    } catch (error) {
      return { error: errorHandler(error, showAlert) };
    }
  }
}

export const transactionsServices = new TransactionsServices();
