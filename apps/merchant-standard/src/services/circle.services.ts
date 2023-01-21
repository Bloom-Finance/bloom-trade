import axios, { AxiosError } from 'axios';
import { doc, updateDoc } from 'firebase/firestore';
import { firebaseManager } from './firebase.manager';
import {
  CircleCryptoPayoutResponse,
  CircleFiatPayoutResponse,
  CirclePayoutResponse,
  CircleWireBankAccount,
} from '../type';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from '@bloom-trade/utilities';
import { showAlert } from '../components/alert/handler';
import { BloomBankAccount, CircleBalances, BloomError } from '../type';

interface ICircleServices {
  saveApiKey(apiKey: string, userId: string): Promise<void>;
  getWallets(
    apiKey: string
  ): Promise<{ data: { address: string; currency: string; chain: string }[] }>;
  createWireBankAccount(
    apiKey: string,
    data: BloomBankAccount
  ): Promise<{ data?: CircleWireBankAccount; error?: BloomError<AxiosError> }>;
  listAllWireBankAccounts(apiKey: string): Promise<{
    data: CircleWireBankAccount[];
  }>;
  withdrawToWireBankAccount(
    apikey: string,
    id: string,
    amount: number,
    currency: string,
    beneficiaryEmail: string
  ): Promise<{
    data?: CirclePayoutResponse;
    error?: BloomError<AxiosError>;
  }>;
  getWithdrawOrderById(
    id: string
  ): Promise<CircleFiatPayoutResponse | CircleCryptoPayoutResponse>;
  getBalance(apiKey: string): Promise<CircleBalances>;
  getAllWithdrawalsOrders(
    apiKey: string,
    status: 'pending' | 'complete' | 'failed'
  ): Promise<Array<CircleFiatPayoutResponse | CircleCryptoPayoutResponse>>;
  checkCredentials(apiKey: string): Promise<{
    isApiKeyCorrect: boolean;
    errorMessage?: string;
  }>;
}

class CircleServices implements ICircleServices {
  async checkCredentials(
    apiKey: string
  ): Promise<{ isApiKeyCorrect: boolean; errorMessage?: string }> {
    try {
      const { data } = await axios.get(`${this.circle_url}/configuration`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return {
        isApiKeyCorrect: true,
      };
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        errorHandler('Unknown error', showAlert);
      }
      const catchedError = error as AxiosError<{
        code: number;
        message: string;
      }>;
      return {
        isApiKeyCorrect: false,
        errorMessage: catchedError.message,
      };
    }
  }
  private circle_url: string = process.env.CIRCLE_URL as string;
  getWithdrawOrderById(
    id: string
  ): Promise<CircleFiatPayoutResponse | CircleCryptoPayoutResponse> {
    throw new Error('Method not implemented.');
  }
  async getAllWithdrawalsOrders(
    apiKey: string,
    status: 'pending' | 'complete' | 'failed'
  ): Promise<Array<CircleFiatPayoutResponse | CircleCryptoPayoutResponse>> {
    try {
      const { data: res } = await axios.get<{
        data: Array<CircleFiatPayoutResponse | CircleCryptoPayoutResponse>;
      }>(
        `${this.circle_url}/businessAccount/payouts?type=wire&status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
      throw new Error('Internal Server Error');
    }
  }
  async getBalance(apiKey: string): Promise<CircleBalances> {
    try {
      const { data: res } = await axios.get<{ data: CircleBalances }>(
        `${this.circle_url}/businessAccount/balances`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
      throw new Error('Internal Server Error');
    }
  }

  async withdrawToWireBankAccount(
    apikey: string,
    id: string,
    amount: number,
    currency: string,
    beneficiaryEmail: string
  ): Promise<{
    data?: CirclePayoutResponse;
    error?: BloomError<AxiosError>;
  }> {
    const idempotencyKey = uuidv4();
    try {
      const { data: res } = await axios.post<{
        data: CirclePayoutResponse;
      }>(
        `${this.circle_url}/businessAccount/payouts`,
        {
          idempotencyKey,
          destination: {
            type: 'wire',
            id,
          },
          amount: {
            currency,
            amount,
          },
          metadata: {
            beneficiaryEmail,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${apikey}`,
          },
        }
      );
      return res;
    } catch (error) {
      return {
        error: errorHandler<AxiosError>(error, showAlert),
      };
    }
  }
  async listAllWireBankAccounts(
    apiKey: string
  ): Promise<{ data: CircleWireBankAccount[] }> {
    try {
      const { data: res } = await axios.get<{
        data: CircleWireBankAccount[];
      }>(`${this.circle_url}/businessAccount/banks/wires`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return res;
    } catch (error) {
      console.log(error);
      throw new Error('Error listing all wire bank accounts');
    }
  }
  async createWireBankAccount(
    apiKey: string,
    data: BloomBankAccount
  ): Promise<{ data?: CircleWireBankAccount; error?: BloomError<AxiosError> }> {
    try {
      const idempotencyKey = uuidv4();
      const wireBank = {
        accountNumber: data.accountNumber,
        routingNumber: data.routingNumber,
        bankAddress: {
          city: data.bankAddress.city,
          country: data.bankAddress.country,
        },
        billingDetails: {
          name: data.billingDetails.name,
          city: data.billingDetails.city,
          country: data.billingDetails.country,
          district: data.billingDetails.district,
          postalCode: data.billingDetails.postalCode,
          line1: data.billingDetails.line1,
        },
        type: data.type,
      };
      const { data: res } = await axios.post<{
        data: CircleWireBankAccount;
      }>(
        `${this.circle_url}/businessAccount/banks/wires`,
        {
          ...wireBank,
          idempotencyKey,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      return {
        data: res.data,
      };
    } catch (error) {
      return {
        error: errorHandler<AxiosError>(error, showAlert),
      };
    }
  }
  async getWallets(
    apiKey: string
  ): Promise<{ data: { address: string; currency: string; chain: string }[] }> {
    const { data: res } = await axios.get<{
      data: Array<{ address: string; currency: string; chain: string }>;
    }>(`${this.circle_url}/businessAccount/wallets/addresses/deposit`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return res;
  }
  async saveApiKey(apiKey: string, userId: string): Promise<void> {
    //TODO: Add wallets of circle
    try {
      await updateDoc(doc(firebaseManager.getDB(), 'users', userId), {
        circleApiKey: apiKey,
      });
    } catch (error) {
      throw new Error('User could not be updated');
    }
  }
}

export const circleServices = new CircleServices();
