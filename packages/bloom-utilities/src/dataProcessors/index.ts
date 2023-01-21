import {
  Chain,
  CHAINS,
  Provider,
  Transaction,
  CUSTODIALPROVIDERS,
  CustodialProvider,
} from '@bloom-trade/types';
import { sumTwoFloatingStrings } from '../strings';

const getLatestBlocksAndDatesByTx = (
  transactions: Transaction[]
): {
  custodialProviders?: { id: Provider; date: number }[];
  selfCustodialProviders?: { chain: Chain; block: number }[];
} => {
  //staff
  const CHAINS: CHAINS = ['eth', 'avax', 'polygon'];
  const CUSTODIALPROVIDERS: CUSTODIALPROVIDERS = [
    'binance',
    'coinbase',
    'circle',
  ];
  const custodialProviders: { id: Provider; date: number }[] = [];
  const selfCustodialProviders: { chain: Chain; block: number }[] = [];
  transactions.forEach((tx) => {
    if (CUSTODIALPROVIDERS.includes(tx.provider as CustodialProvider)) {
      //process custodial providers
      const index = custodialProviders.findIndex(
        (item) => item.id === tx.provider
      );
      //Si no existe el provider en el array, lo agregamos
      if (index < 0)
        custodialProviders.push({ id: tx.provider, date: tx.timestamp });
      //Si existe el provider en el array, comparamos la fecha
      else if (
        selfCustodialProviders[index] &&
        custodialProviders[index].date < tx.timestamp
      )
        custodialProviders[index].date = tx.timestamp;
    }
    if (tx.chain && CHAINS.includes(tx.chain as Chain) && tx.block) {
      //process self custodial providers
      const index = selfCustodialProviders.findIndex(
        (item) => item.chain === tx.chain
      );
      //Si no existe el provider en el array, lo agregamos
      if (index < 0)
        selfCustodialProviders.push({
          chain: tx.chain,
          block: parseInt(tx.block),
        });
      //Si existe el provider en el array, comparamos la fecha
      else if (
        selfCustodialProviders[index] &&
        selfCustodialProviders[index].block < parseInt(tx.block)
      )
        selfCustodialProviders[index].block = parseInt(tx.block);
    }
  });
  return {
    custodialProviders,
    selfCustodialProviders,
  };
};

const getWeeklyIncome = (transactions: Transaction[]): number => {
  const theWeekBefore = Date.now() - 604800000;
  let totalIncome = 0;
  transactions.forEach((tx) => {
    if (tx.timestamp > theWeekBefore && tx.type === 'in') {
      totalIncome = sumTwoFloatingStrings(totalIncome.toString(), tx.amount, 3);
    }
  });
  return totalIncome;
};
const getWeeklyOutcome = (transactions: Transaction[]): number => {
  const theWeekBefore = Date.now() - 604800000;
  let totalOutcome = 0;
  transactions.forEach((tx) => {
    if (tx.timestamp > theWeekBefore && tx.type === 'out') {
      totalOutcome = sumTwoFloatingStrings(
        totalOutcome.toString(),
        tx.amount,
        3
      );
    }
  });
  return totalOutcome;
};

export { getLatestBlocksAndDatesByTx, getWeeklyIncome, getWeeklyOutcome };
