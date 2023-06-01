import {
  ApiResponse,
  Balance,
  Chain,
  CustodialProvider,
  Environment,
  IBloomServices,
  Order,
  User,
  Vault,
} from '@bloom-trade/types';
import axios from 'axios';

interface IProvidersRequest {
  type: 'circle' | 'binance' | 'coinbase';
  auth: {
    apiKey?: string;
    apiSecret?: string;
  };
}

class BloomServices implements IBloomServices {
  private url: string;
  private isTestnet: boolean = false;

  public stripe: {
    createPaymentIntent(
      amount: number,
      currency: string
    ): Promise<{ clientSecret: string }>;
  } = {
    createPaymentIntent: async (amount: number, currency: 'usd') => {
      try {
        const { data } = await axios.post<{ clientSecret: string }>(
          `${this.url}/stripe/paymentIntent`,
          {
            amount: amount,
            currency,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return data;
      } catch (error) {
        throw new Error(error as any);
      }
    },
  };

  constructor(params: { test?: boolean; apiUrl: string }) {
    this.url = params.apiUrl;
    this.isTestnet = params.test || false;
  }

  async getUser(): Promise<{ user: User }> {
    try {
      const { data } = await axios.get<{ user: User }>(`${this.url}/user`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data;
    } catch (error) {
      throw new Error(error as any);
    }
  }

  async getVaults(): Promise<{ vaults: Vault[] }> {
    try {
      const {
        data: { data: res },
      } = await axios.get<ApiResponse<Bloom.Vault[]>>(`${this.url}/vault`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return {
        vaults: res,
      };
    } catch (error) {
      throw new Error(error as any);
    }
  }

  async getBalance(
    config: {
      dex?: { addresses: string[]; chains?: Chain[] } | undefined;
      cex?:
        | {
            id: CustodialProvider;
            auth: {
              apiKey?: string | undefined;
              apiSecret?: string | undefined;
            };
          }[]
        | undefined;
    },
    params?: {
      onlyStableCoins: boolean;
    }
  ): Promise<Balance> {
    const { dex, cex } = config;
    const addresses: string[] | undefined = dex?.addresses;
    const chains: Chain[] | undefined = dex?.chains;
    const providers: IProvidersRequest[] = [];

    if (cex) {
      cex.forEach((provider) => {
        const { id, auth } = provider;
        const { apiKey, apiSecret } = auth;
        providers.push({
          type: id,
          auth: {
            apiKey,
            apiSecret,
          },
        });
      });
    }
    let url = `${this.url}/wallet/balance?testnet=${this.isTestnet}`;
    if (params?.onlyStableCoins) {
      url += `&stableCoins=true`;
    }
    const { data: res } = await axios.post<ApiResponse<Balance>>(
      url,
      {
        addresses,
        providers,
        chains,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  }

  async getOrder(id: string): Promise<Order> {
    try {
      const { data: res } = await axios.get<ApiResponse<Order>>(
        `${this.url}/order/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return res.data;
    } catch (error) {
      throw new Error(error as any);
    }
  }
}

export default BloomServices;
