import { useEffect, useState } from 'react';
import {
  CircleBalances,
  CircleCryptoPayoutResponse,
  CircleFiatPayoutResponse,
  CircleWireBankAccount,
} from '../type';
import { circleServices } from '../services/circle.services';
import { UserStore } from '../store/user.store';
import { showAlert } from '../components/alert/handler';
import { useRouter } from 'next/router';

export default function useCircle() {
  const router = useRouter();
  const apiKey = UserStore.useState((s) => s.circleApiKey);
  const [circleLoading, setCircleLoading] = useState(false);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    Array<CircleFiatPayoutResponse | CircleCryptoPayoutResponse>
  >([]);
  const [completedWithdrawals, setCompletedWithdrawals] = useState<
    Array<CircleFiatPayoutResponse | CircleCryptoPayoutResponse>
  >([]);
  const [balance, setBalance] = useState<CircleBalances>();
  const [wireBankAccounts, setWireBankAccounts] =
    useState<Array<CircleWireBankAccount>>();

  useEffect(() => {
    (async () => {
      setCircleLoading(true);
      if (!apiKey) {
        showAlert('You need to provide an api key first', 'error', () => {
          router.push('/dashboard');
        });
        return;
      }
      const { data: res } = await circleServices.listAllWireBankAccounts(
        apiKey
      );
      const balance = await circleServices.getBalance(apiKey);
      const retrievedPendingWithdrawals =
        await circleServices.getAllWithdrawalsOrders(apiKey, 'pending');
      const retrivedCompletedWithdrawals =
        await circleServices.getAllWithdrawalsOrders(apiKey, 'complete');
      setPendingWithdrawals(retrievedPendingWithdrawals);
      setCompletedWithdrawals(retrivedCompletedWithdrawals);
      setBalance(balance);
      setWireBankAccounts(res);
      setCircleLoading(false);
    })();
  }, []);
  async function withdraw(
    toBankId: string,
    amount: number,
    currency: string,
    email: string
  ) {
    setCircleLoading(true);
    const { data, error } = await circleServices.withdrawToWireBankAccount(
      apiKey as string,
      toBankId,
      amount,
      currency,
      email
    );

    if (error && !data) {
      setCircleLoading(false);
      return {
        res: {
          success: false,
        },
      };
    }
    const newPendingWithdarwals = await circleServices.getAllWithdrawalsOrders(
      apiKey as string,
      'pending'
    );
    setPendingWithdrawals(newPendingWithdarwals);
    setCircleLoading(false);
    const balance = await circleServices.getBalance(apiKey as string);
    setBalance(balance);
    return {
      res: {
        success: true,
        data,
      },
    };
  }

  return {
    withdraw,
    balance,
    wireBankAccounts,
    pendingWithdrawals,
    completedWithdrawals,
    circleLoading,
  };
}
