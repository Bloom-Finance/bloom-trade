import { CID } from 'multiformats/cid';
export = Bloom;
export as namespace Bloom;

declare namespace Bloom {
  /* This alias is referred to all the Bloom Gnosis Safe */
  namespace Safe {
    const enum SafeService {
      ethereum = 'https://safe-transaction.mainnet.gnosis.io/',
      avalanche = 'https://safe-transaction.avalanche.gnosis.io/',
      polygon = 'https://safe-transaction.polygon.gnosis.io/',
      testnet = 'https://safe-transaction.goerli.gnosis.io/',
    }
  }

  /* This alias is referred to all the Bloom Firebase Types */
  namespace Firebase {
    type wallets = {
      id: string;
      address: string;
      chains: string[];
      brand: Bloom.Brand;
      isPrincipal: boolean;
      owner: string; // userId
      currency: string;
    };
  }
  /* This alias is referred to all the Bloom Ipfs Types */
  namespace Ipfs {
    type BloomIpfsSdk = {
      save(payload: Record<string, any>): Promise<CID>;
      get(cid: CID): Promise<Record<string, any>>;
    };
  }

  const enum Environment {
    production = 'https://merchant.bloom.trade/api',
    sandbox = 'https://test.bloom.trade/api',
    local = 'http://localhost:3000/api',
  }

  const enum Scanners {
    goerli = 'https://goerli.etherscan.io',
    mumbai = 'https://mumbai.polygonscan.com',
    fuji = 'https://testnet.snowtrace.io',
    eth = 'https://etherscan.io',
    polygon = 'https://polygonscan.com',
    avax = 'https://snowtrace.io',
  }

  interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
  }

  type User = {
    id: string;
    displayName?: string;
    transakApiKey?: string;
    circleApiKey?: string;
    email?: string;
    plugins?: Array<Plugin>;
    iat: number;
  };
  const enum PaymentMethod {
    creditCard = 'creditCard',
    bankAccount = 'bankAccount',
    crypto = 'crypto',
  }
  type PaymentMethods = 'bankAccount' | 'creditCard' | 'crypto';

  type Plugin = {
    id:
      | PaymentMethod.bankAccount
      | PaymentMethod.creditCard
      | PaymentMethod.crypto;
    enabled: boolean;
    auth?: {
      [key: string]: string;
    };
  };
  type IBloomServices = {
    stripe: {
      createPaymentIntent(
        amount: number,
        currency: string
      ): Promise<{ clientSecret: string }>;
    };
    getBalance(
      config: {
        dex?: {
          addresses: string[];
          chains: Chain[];
        };
        cex?: {
          id: CustodialProvider;
          auth: {
            apiKey?: string;
            apiSecret?: string;
          };
        }[];
      },
      params?: {
        onlyStableCoins: boolean;
      }
    ): Promise<Balance>;
    getVaults(): Promise<{ vaults: Bloom.Vault[] }>;
    getUser(): Promise<{ user: User }>;
  };
  type Receipt = {
    id: string;
    type: PaymentMethods;
    createdAt: number;
    currency: Asset | string;
    chain?: Chain;
    status: 'pending' | 'completed' | 'failed';
    txHash?: string;
    total: {
      details?: {
        items?: {
          description: string;
          amount: number;
        }[];
        taxes?: {
          description: string;
          amount: number;
        }[];
      };
      amount: number;
    };
  };
  type Balance = {
    asset: Asset;
    balance: string;
    description: string;
    detail: Array<{
      address?: string;
      provider: string;
      chain?: string;
      balance: string;
    }>;
  }[];
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
  type Order = {
    _id: number;
    orderId: string;
    status: 'pending' | 'completed' | 'failed';
    type: 'crypto' | 'creditCard' | 'bankAccount';
    txHash?: `0x${string}`;
    iat: number;
    from?: {
      chain: Chain;
      address: string;
      token: StableCoin;
      description?: {
        name: string;
      };
    };
    total: {
      details?: {
        items?: {
          description: string;
          amount: number;
        }[];
        taxes?: {
          description: string;
          amount: number;
        }[];
      };
      amount: number;
    };
    destination?: {
      chain: Chain;
      address: string;
      token: StableCoin;
      description?: {
        name?: string;
        image?: string;
      };
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
  type Brand = 'circle' | 'mm' | 'trust' | 'notDefined' | 'walletConnect';
  type Wallet = Firebase.wallets & {
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
  };
  type Vault = {
    _id?: string;
    uid: string;
    chain: Chain | 'goerli';
    address: string;
    owners?: string[];
    threshold: number;
    balance: {
      asset: Asset;
      amount: string;
    }[];
  };
}
