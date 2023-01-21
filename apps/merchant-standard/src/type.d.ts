import { StringDecoder } from 'string_decoder';

export interface SessionUser {
  userId: string;
  iat: number;
}

interface Web3AuthSessionPayloadSocialMedia {
  email: string;
  name: string;
  wallets: Array<{
    public_key: string;
    type: string;
    curve: string;
  }>;
}

interface Web3AuthSessionPayloadWeb3 {
  wallets: Array<{
    address: string;
    type: string;
  }>;
}

interface WalletsUsers {
  walletAddress: string;
  userId: string;
}

interface User {
  id: string;
  email?: string;
  displayName?: string;
  iat: number;
  circleApiKey?: string;
  transakApiKey?: string;
}

type CryptoWallet = {
  id: string;
  address: string;
  chains: string[];
  brand: Brands;
  isPrincipal: boolean;
  owner: string; // userId
  currency: string;
};

interface CircleWireBankAccount {
  id: string;
  status: string;
  description: string;
  trackingRef: string;
  fingerprint: string;
  billingDetails: {
    name: string;
    city: string;
    country: string;
    line1: string;
    line2: string;
    district: string;
    postalCode: string;
  };
  bankAddress: {
    bankName: string;
    city: string;
  };
}

interface CirclePayoutResponse {
  id: string;
  sourceWalletId: string;
  createDate: string;
  updateDate: string;
  destination: {
    type: string;
    id: string;
    name: string;
  };
  amount: {
    amount: string;
    currency: string;
  };
  status: string;
}

interface CircleFiatPayoutResponse {
  id: string;
  sourceWalletId: string;
  destination: {
    type: string;
    id: string;
    name: string;
  };
  toAmount?: {
    amount: string;
    currency: string;
  };
  amount: {
    amount: string;
    currency: string;
  };
  fees?: {
    amount: string;
    currency: string;
  };
  status: string;
  trackingRef?: string;
  externalRef?: string;
  errorCode?: string;
  riskEvaluation?: {
    decision: string;
    reason: string;
  };
  adjustments?: {
    fxCredit: {
      amount: string;
      currency: string;
    };
    fxDebit: {
      amount: string;
      currency: string;
    };
  };
  return: {
    id: string;
    payoutId: string;
    amount: {
      amount: string;
      currency: string;
    };
    fees: {
      amount: string;
      currency: string;
    };
    reason: string;
    status: string;
    createDate: string;
    updateDate: string;
  };
  createDate: string;
  updateDate: string;
}

interface CircleCryptoPayoutResponse {
  id: string;
  sourceWalletId: string;
  destination: {
    type: string;
    id: string;
  };
  toAmount?: {
    amount: string;
    currency: string;
  };
  amount: {
    amount: string;
    currency: string;
  };
  fees: {
    amount: string;
    currency: string;
  };
  status: string;
  errorCode?: string;
  riskEvaluation?: {
    decision: string;
    reason: string;
  };
  createDate: string;
  updateDate: string;
}
export interface CircleBalances {
  available: Array<CircleWallet>;
  unsettled: Array<CircleWallet>;
}
export type CircleWallet = {
  amount: string;
  currency: string;
};

export interface CircleError {
  code: number;
  message: string;
}

export interface BloomError<T> {
  isError: true;
  code?: number;
  msg?: string;
  unknown?: boolean;
  errorObj?: T;
}

export type BloomBankAccount = {
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

export type BankAccountForm = {
  accountType: 'wire' | 'ach' | 'sepa';
  countryCode: string;
  accountNumber: string;
  routingNumber: string;
  bankAddress: {
    city: string;
    country: string;
  };
  billingDetails: {
    name: string;
    country: string;
    city: string;
    line1: string;
    district: string;
    postalCode: string;
  };
};

export type Brands = 'circle' | 'mm' | 'trust' | 'notDefined' | 'walletConnect';
