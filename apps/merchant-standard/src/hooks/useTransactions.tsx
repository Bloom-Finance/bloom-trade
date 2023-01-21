import { Transaction } from '@bloom-trade/types';
import {
  getLatestBlocksAndDatesByTx,
  getWeeklyIncome,
  getWeeklyOutcome,
} from '@bloom-trade/utilities';
import { useEffect, useState } from 'react';
import { transactionsServices } from '../services/transactions.services';
import { TransactionsStore } from '../store/transactions.store';
import { UserStore } from '../store/user.store';

export default function useTransactions() {
  const [fetching, setFetching] = useState<boolean>();
  const [weeklyIncome, setWeeklyIncome] = useState<number>();
  const [weeklyOutcome, setWeeklyOutcome] = useState<number>();
  const refreshParams = TransactionsStore.useState(
    (s) => s.catchedFetchingParams
  );
  const user = UserStore.useState((s) => s);
  const transactions = TransactionsStore.useState((s) => s.transactions);
  useEffect(() => {
    setFetching(true);
    setWeeklyIncome(getWeeklyIncome(transactions));
    setWeeklyOutcome(getWeeklyOutcome(transactions));
    setFetching(false);
  }, [transactions]);
  async function refresh() {
    setFetching(true);
    const { data } = await transactionsServices.getTransactions({
      ...refreshParams,
      circleApiKey: user.circleApiKey,
    });
    if (!data) return;
    const newFetchingParams = getLatestBlocksAndDatesByTx(data);
    const refreshedTransactions: Transaction[] = [];
    data.forEach((tx) => {
      if (tx.block) {
        const isAlreadyInStore = transactions.find((t) => t.block === tx.block);
        if (!isAlreadyInStore) {
          refreshedTransactions.push(tx);
        }
      } else {
        //is a custodial provider transaction
        const isAlreadyInStore = transactions.find(
          (t) => t.timestamp === tx.timestamp
        );
        if (!isAlreadyInStore) {
          refreshedTransactions.push(tx);
        }
      }
    });
    TransactionsStore.update((s) => {
      s.transactions = [...refreshedTransactions, ...s.transactions];
      s.catchedFetchingParams = newFetchingParams;
    });
    setFetching(false);
  }
  return {
    transactions,
    refresh,
    fetching,
    weeklyIncome,
    weeklyOutcome,
  };
}
