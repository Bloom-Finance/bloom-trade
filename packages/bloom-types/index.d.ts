export = Bloom;
export as namespace Bloom;
declare namespace Bloom {
  type BloomError<T> = {
    isError: true;
    code?: number;
    msg?: string;
    unknown?: boolean;
    errorObj?: T;
  };
  type BloomBankAccount = {
    id: string;
    owner: string;
    type: 'wire' | 'ach' | 'sepa';
    country: string;
    circle: {
      isLinked: boolean;
      id?: string;
    };
    accountNumber: string;
    routingNumber: string;
    bankAddress: {
      city: string;
      country: string;
    };
    billingDetails: {
      name: string;
      country: string;
      line1: string;
      city: string;
      district: string;
      postalCode: string;
    };
  };

  type Asset = 'usdt' | 'usdc' | 'dai' | 'eth' | 'btc' | 'matic' | 'avax';
  type StableCoin = 'usdt' | 'usdc' | 'dai';
  type STABLECOINS = ['usdt', 'usdc', 'dai'];
  type Provider =
    | 'binance'
    | 'etherscan'
    | 'coinbase'
    | 'snowtrace'
    | 'circle'
    | 'polygonscan';
  type Chain = 'eth' | 'avax' | 'polygon';
  type Testnet = 'goerli' | 'mumbai' | 'fuji';
  type CHAINS = ['eth', 'avax', 'polygon'];
  type CustodialProvider = 'binance' | 'coinbase' | 'circle';
  type CUSTODIALPROVIDERS = ['binance', 'coinbase', 'circle'];
  type Transaction = {
    asset: Asset;
    amount: string;
    from: string;
    to: string;
    type: 'in' | 'out';
    status: 'pending' | 'completed' | 'failed';
    timestamp: number;
    chain?: Chain;
    provider: Provider;
    block?: string;
    gas?: string;
    gasPrice?: string;
    gasUsed?: string;
  };
}
