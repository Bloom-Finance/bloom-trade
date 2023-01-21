import { Asset, Transaction, Chain, Provider } from '@bloom-trade/types';

/* eslint-disable @typescript-eslint/no-namespace */
export interface IConnector {
  getClient(providerConnection: ProviderCredentials[]): Client;
}
export interface Client {
  getBalance(): Promise<Balance>;
  getProvider(id: Providers);
  getTransactionHistory(config: {
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
  }): Promise<Transaction[]>;
  providers: ProviderCredentials[];
}
export interface IProviderConnector {
  getBalance(): Promise<
    {
      asset: string;
      balance: string;
      description: string;
      detail: Array<{
        address: string;
        provider: string;
        chain: string;
        balance: string;
      }>;
    }[]
  >;
}
export type Contracts = {
  token: Asset;
  networks: {
    chain: Chain;
    address: string;
    decimalPosition: number;
  }[];
}[];
export type ProviderCredentials = {
  addresses?: string[];
  chain?: Chains;
  provider: {
    id: Providers;
    useTestnet: boolean;
    auth: {
      apiKey?: string;
      apiSecret?: string;
    };
  };
};
export type Providers =
  | 'binance'
  | 'etherscan'
  | 'coinbase'
  | 'snowtrace'
  | 'circle'
  | 'polygonscan';
export type Chains = 'eth' | 'polygon' | 'avax';
export type Assets = 'eth' | 'usdt' | 'dai' | 'btc' | 'matic' | 'avax';

export type Balance = {
  asset: string;
  balance: string;
  description: string;
  detail: Array<{
    address?: string;
    provider: string;
    chain?: string;
    balance: string;
  }>;
}[];

export type Prices = {
  date: number;
  high: string;
  low: string;
  close: string;
  volume: string;
  asset: Assets;
}[];
export type PoloniexPrice = {
  date: string;
  high: string;
  low: string;
  open: string;
  close: string;
  volume: string;
  quoteVolume: string;
  weightedAverage: string;
};
