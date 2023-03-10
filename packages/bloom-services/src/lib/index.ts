import {
  Balance,
  Chain,
  CustodialProvider,
  Environment,
  IBloomServices,
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
  private apiKey: string;
  private apiSecret: string;
  private isTestnet: boolean = false;
  constructor(
    apiKey: string,
    apiSecret: string,
    params?: { test?: boolean; local?: boolean }
  ) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    if (params?.test) {
      this.url = Environment.sandbox;
      this.isTestnet = true;
    } else {
      this.url = Environment.production;
    }
  }
  async getVaults(): Promise<{ vaults: Vault[] }> {
    try {
      const { data } = await axios.get<{ vaults: Bloom.Vault[] }>(
        `${this.url}/vault`,
        {
          headers: {
            apiKey: this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      return data;
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
    let url = `${this.url}/wallets/balance?testnet=${this.isTestnet}`;
    if (params?.onlyStableCoins) {
      url += `&stableCoins=true`;
    }
    const { data } = await axios.post<{ balance: Balance }>(
      url,
      {
        addresses,
        providers,
        chains,
      },
      {
        headers: {
          apiKey: this.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return data.balance;
  }
}

export default BloomServices;
