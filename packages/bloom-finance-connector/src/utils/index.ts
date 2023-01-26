/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ProviderCredentials,
  Providers,
  Client,
  Balance,
  Contracts,
  PoloniexPrice,
} from '../@types/index';
import Web3 from 'web3';
import { cryptocurrencies } from '../data/cryptocurrencies';
import { contracts } from '../data/contracts';
import {
  Transaction,
  Chain,
  Asset,
  Provider,
  STABLECOINS,
  StableCoin,
} from '@bloom-trade/types';
import axios from 'axios';
import moment from 'moment';
const sum = (a: any, b: any, positions: number) => {
  const factor = Math.pow(10, positions);
  return (
    (a.toFixed(positions) * factor + b.toFixed(positions) * factor) / factor
  );
};
const setClient = (providerConnection: ProviderCredentials[]): Client => {
  const providers = providerConnection;
  return {
    providers,
    getProvider(id) {
      //staff this function to return the provider object
    },
    async getBalance() {
      const balance: Balance = [];
      for (const connection of providerConnection) {
        const {
          ProviderConnectorImpl,
        } = require(`../impl/${connection.provider.id}/index`);
        const service = new ProviderConnectorImpl(connection);
        const res = (await service.getBalance()) as Balance;
        res.forEach((e) => {
          const foundElement = balance.find(
            (element) => element.asset === e.asset
          );
          if (!foundElement) {
            balance.push(e);
          } else {
            if (
              foundElement.asset === 'eth' ||
              foundElement.asset === 'matic' ||
              foundElement.asset === 'avax'
            ) {
              const index = balance.indexOf(foundElement);
              balance[index].balance = sumEthsBalances(
                foundElement.balance,
                e.balance
              );
              balance[index].detail.push(...e.detail);
            } else {
              const index = balance.indexOf(foundElement);

              balance[index].balance = sum(
                parseFloat(e.balance),
                parseFloat(balance[index].balance),
                3
              ).toString();
              balance[index].detail.push(...e.detail);
            }
          }
        });
      }
      return balance;
    },
    async getTransactionHistory(params: {
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
    }) {
      let transactions: Transaction[] = [];
      const StableAssets: STABLECOINS = ['usdt', 'usdc', 'dai'];
      for (const connection of providerConnection) {
        const {
          ProviderConnectorImpl,
        } = require(`../impl/${connection.provider.id}/index`);
        const service = new ProviderConnectorImpl(connection);
        const res = (await service.getTransactionHistory(
          params
        )) as Transaction[];
        res.forEach((e) => {
          transactions.push(e);
        });
      }
      switch (params.order) {
        case 'asc':
          transactions.sort((a, b) => a.timestamp - b.timestamp);
          break;
        case 'desc':
          transactions.sort((a, b) => b.timestamp - a.timestamp);
        default:
          break;
      }
      if (params.filters && params.filters.onlyStables) {
        transactions = transactions.filter((tx) => {
          if (StableAssets.includes(tx.asset as StableCoin)) {
            return tx;
          }
        });
      }
      return transactions;
    },
  };
};
const getDescription = (asset: string) => {
  const myKeys = Object.keys(cryptocurrencies);
  const foundKey = myKeys.find((e) => e === asset);
  if (!foundKey) return '';
  return cryptocurrencies[foundKey];
};
const getSupportedContracts = () => {
  return contracts.tokens as Contracts;
};
const manageBaseUrl = (connection: ProviderCredentials): string => {
  let url = '';
  if (!connection.provider.useTestnet) {
    url = setProdUrl(connection.provider.id);
  } else {
    url = setTestUrl(connection.provider.id);
  }
  return url;
  //staff this function to return the base url
};
const setProdUrl = (provider: Providers) => {
  switch (provider) {
    case 'binance':
      return 'https://api.binance.com';
    case 'etherscan':
      return 'https://api.etherscan.io/api';
    case 'polygonscan':
      return 'https://api.polygonscan.com/api';
    case 'snowtrace':
      return 'https://snowtrace.io/api';
    case 'circle':
      return 'https://api.circle.com/v1';
    default:
      return 'https://api.etherscan.io/api';
  }
};
const setTestUrl = (provider: Providers) => {
  switch (provider) {
    case 'binance':
      return 'https://testnet.binance.vision';
    case 'etherscan':
      return 'https://api-goerli.etherscan.io/api';
    case 'polygonscan':
      return 'https://api-testnet.polygonscan.com/api';
    case 'snowtrace':
      return 'https://api-testnet.snowtrace.io/api';
    case 'circle':
      return 'https://api-sandbox.circle.com/v1';
    default:
      return 'https://api-goerli.etherscan.io/api';
  }
};
const getTestnetByMainnet = (chain: Chain) => {
  switch (chain) {
    case 'eth':
      return 'goerli';
    case 'avax':
      return 'fuji';
    case 'polygon':
      return 'mumbai';
    default:
      return 'goerli';
  }
};
const sumEthsBalances = (referenceBalance: string, balanceToAdd: string) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  const totalBalanceInWei = web3.utils.toWei(referenceBalance, 'ether');
  const foundElementInWei = web3.utils.toWei(balanceToAdd, 'ether');
  const newBalance = web3.utils
    .toBN(totalBalanceInWei)
    .add(web3.utils.toBN(foundElementInWei))
    .toString();
  const formattedBalance = web3.utils.fromWei(newBalance, 'ether');
  return formattedBalance;
};
const weiToEth = (value: string) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  return web3.utils.fromWei(value, 'ether');
};
const convertToken = (value: string, decimals: number) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  return web3.utils
    .toBN(value)
    .div(web3.utils.toBN(10 ** decimals))
    .toString();
};
const getAssetPriceInUSDC = async (
  asset: Asset,
  startDate: number,
  endDate: number
) => {
  //staff this function to return the price of the asset in USDC
  try {
    const { data } = await axios.get(
      `https://poloniex.com/public?command=returnChartData&currencyPair=USDC_${asset.toUpperCase()}&start=${startDate}&end=${endDate}&period=14400`
    );
    return data[0] as PoloniexPrice;
  } catch (error) {
    throw new Error();
  }
};
const getAssetDataByChain = (
  contract: {
    token: Asset;
    networks: {
      chain: Chain;
      address: string;
      decimalPosition: number;
    }[];
  },
  chain: Chain,
  provider: {
    id: Providers;
    useTestnet: boolean;
    auth: {
      apiKey?: string;
      apiSecret?: string;
    };
  }
) => {
  const filteredContract = contract.networks.find(
    (e) =>
      e.chain ===
      (provider.useTestnet
        ? getTestnetByMainnet(chain as Chain)
        : chain === 'eth'
        ? 'erc20'
        : chain)
  );
  return filteredContract as {
    chain: Chain;
    address: string;
    decimalPosition: number;
  };
};

const stringToMilisecondsDate = (string: string) => {
  const date = new Date(string);
  return date.getTime();
};
const fDate = (date: number) => {
  return moment(date).format();
};
export {
  setClient,
  getDescription,
  manageBaseUrl,
  getSupportedContracts,
  weiToEth,
  convertToken,
  getAssetPriceInUSDC,
  getTestnetByMainnet,
  getAssetDataByChain,
  fDate,
  stringToMilisecondsDate,
};
