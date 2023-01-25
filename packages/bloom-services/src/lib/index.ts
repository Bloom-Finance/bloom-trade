import {
  Balance,
  Chain,
  CustodialProvider,
  Environment,
  IBloomServices,
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
  private token: string;
  private isTestnet: boolean = false;
  constructor(apiToken: string, params?: { test?: boolean }) {
    this.token = apiToken;
    if (params?.test) {
      this.url = Environment.sandbox;
      this.isTestnet = true;
    } else {
      this.url = Environment.production;
    }
  }
  async getBalance(config: {
    dex?: { addresses: string[]; chains?: Chain[] } | undefined;
    cex?:
      | {
          id: CustodialProvider;
          auth: { apiKey?: string | undefined; apiSecret?: string | undefined };
        }[]
      | undefined;
  }): Promise<Balance> {
    const { dex, cex } = config;
    const addresses: string[] | undefined = dex?.addresses;
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
    const { data } = await axios.post<Balance>(
      `${this.url}/wallets/balance?testnet=${this.isTestnet}`,
      {
        addresses,
        providers,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return data;
  }
}

export default BloomServices;
