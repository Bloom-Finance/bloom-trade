export = Bloom;
export as namespace Bloom;
declare namespace Bloom {
  const enum Environment {
    production = "https://api.bloom.com",
    sandbox = "/api",
  }
  const enum Scanners {
    goerli = "https://goerli.etherscan.io",
    mumbai = "https://mumbai.polygonscan.com",
    fuji = "https://testnet.snowtrace.io",
    eth = "https://etherscan.io",
    polygon = "https://polygonscan.com",
    avax = "https://snowtrace.io",
  }
  type User = {
    userid: string;
    displayName: string;
    email: string;
  };
  type IBloomServices = {
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
    isTokenValid<T>(token: string): Promise<{ isValid: boolean; payload: any | T }>;
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
    type: "wire" | "ach" | "sepa";
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
    id: string;
    orderId: string;
    date: number;
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
    destination: {
      chain: Chain;
      address: string;
      token: StableCoin;
      description?: {
        name?: string;
        image?: string;
      };
    };
  };
  type Asset = "usdt" | "usdc" | "dai" | "eth" | "btc" | "matic" | "avax";
  type StableCoin = "usdt" | "usdc" | "dai";
  type STABLECOINS = ["usdt", "usdc", "dai"];
  type Provider = "binance" | "etherscan" | "coinbase" | "snowtrace" | "circle" | "polygonscan";

  type Chain = "eth" | "avax" | "polygon";
  type Testnet = "goerli" | "mumbai" | "fuji";
  type CHAINS = ["eth", "avax", "polygon"];
  type CustodialProvider = "binance" | "coinbase" | "circle";
  type CUSTODIALPROVIDERS = ["binance", "coinbase", "circle"];
  type BLOOM_URL = "https://api.bloom.com" | "https://localhost:3000/api";
  type Transaction = {
    asset: Asset;
    amount: string;
    from: string;
    to: string;
    type: "in" | "out";
    status: "pending" | "completed" | "failed";
    timestamp: number;
    chain?: Chain;
    provider: Provider;
    block?: string;
    gas?: string;
    gasPrice?: string;
    gasUsed?: string;
  };
}
