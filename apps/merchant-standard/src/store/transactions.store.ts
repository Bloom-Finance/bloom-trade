import { Chain, Provider, Transaction } from '@bloom-trade/types';
import { Store } from 'pullstate';

interface ITransactionsStore {
  transactions: Transaction[];
  fetching: boolean;
  catchedFetchingParams: {
    custodialProviders?: { id: Provider; date: number }[];
    selfCustodialProviders?: { chain: Chain; block: number }[];
  };
}

export const TransactionsStore = new Store<ITransactionsStore>({
  transactions: [],
  fetching: false,
  catchedFetchingParams: {},
});
