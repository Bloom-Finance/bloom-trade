import { StableCoin, Testnet, Chain, Asset } from '@bloom-trade/types';
import {
  goerli,
  polygonMumbai,
  avalancheFuji,
  mainnet,
  polygon,
  avalanche,
} from 'wagmi/chains';
import Tokens from '../data/tokens.json';
/**
 * If the address starts with 0x, then it's a web3 wallet.
 * @param {string} address - The address of the wallet.
 * @returns A boolean value.
 */
function isWeb3WalletByAddress(address: string) {
  if (address.startsWith('0x')) {
    return true;
  }
  return false;
}
/**
 * It takes a string as an argument and returns a string
 * @param {string} address - The address to format.
 * @returns A string that is the first 6 characters of the address, followed by 3 dots, followed by the
 * last 4 characters of the address.
 */
const formatWalletAddress = (address: string): string => {
  if (!address) return '';
  if (address.startsWith('0x')) {
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  return address.slice(0, 6) + '...' + address.slice(-4);
};

/**
 * Takes a chain ID as an argument and returns the chain name. (Bloom chain names)
 * @param {number} id - The chain ID of the network you want to connect to.
 * @returns Chain | Testnet | undefined
 */
const getChainNameById = (id: number): Chain | Testnet | undefined => {
  switch (id) {
    case 1:
      return 'eth';
    case 137:
      return 'polygon';
    case 43114:
      return 'avax';
    case 5:
      return 'goerli';
    case 43113:
      return 'fuji';
    case 80001:
      return 'mumbai';
    default:
      return;
  }
};

/**
 * "Given a mainnet chain, return the corresponding testnet chain, or undefined if there is no
 * corresponding testnet chain."
 *
 * The first line of the function is a type annotation. It tells TypeScript that the function takes a
 * parameter of type Chain and returns a value of type Testnet or undefined
 * @param {Chain} chain - The chain you want to use.
 * @returns A testnet name
 */
const getTestnetFromMainnet = (chain: Chain): Testnet | undefined => {
  switch (chain) {
    case 'eth':
      return 'goerli';
    case 'polygon':
      return 'mumbai';
    case 'avax':
      return 'fuji';
    default:
      return;
  }
};

const getChainIdByName = (name: Chain | Testnet): number | undefined => {
  switch (name) {
    case 'eth':
      return 1;
    case 'polygon':
      return 137;
    case 'avax':
      return 43114;
    case 'goerli':
      return 5;
    case 'fuji':
      return 43113;
    case 'mumbai':
      return 80001;
    default:
      break;
  }
};
/**
 * It returns a wagmi instance based on the chain name
 * @param {Testnet | Chain} chain - The chain you want to use.
 * @returns The wagmi instance for the chain
 */
const getWagmiInstanceByChainName = (chain: Testnet | Chain) => {
  switch (chain) {
    case 'goerli':
      return goerli;
    case 'mumbai':
      return polygonMumbai;
    case 'fuji':
      return avalancheFuji;
    case 'eth':
      return mainnet;
    case 'polygon':
      return polygon;
    case 'avax':
      return avalanche;
    default:
      return mainnet;
  }
};

/**
 * It returns the address and decimals of a token given the symbol and chain.
 * @param {StableCoin} symbol - StableCoin - This is the symbol of the token you want to get the
 * contract address for.
 * @param {Chain | Testnet} chain - Chain | Testnet
 */
const getTokenContractAddressBySymbolAndChain = (
  symbol: StableCoin,
  chain: Chain | Testnet
):
  | {
      address: string;
      decimals: number;
    }
  | undefined => {
  const foundSymbol = Tokens.tokens.find((aset) => aset.token === symbol);
  if (!foundSymbol) return;
  const network = foundSymbol.networks.find((network) => {
    if (
      (network.chain === 'erc20' && chain === 'eth') ||
      network.chain === chain
    ) {
      return network;
    }
  });
  if (!network) return;
  return {
    address: network.address,
    decimals: network.decimalPosition,
  };
};

/**
 * It takes a string as an argument and returns a string
 * @param {Asset} symbol - The symbol of the token you want to get the icon for.
 * @returns the icon of the token based on the symbol.
 */
const getTokenIconBySymbol = (symbol: Asset) => {
  switch (symbol) {
    case 'dai':
      return 'https://s2.coinmarketcap.com/static/img/coins/200x200/4943.png';
    case 'usdt':
      return 'https://s2.coinmarketcap.com/static/img/coins/200x200/825.png';
    case 'usdc':
      return 'https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png';
    case 'btc':
      return 'https://s2.coinmarketcap.com/static/img/coins/200x200/1.png';
    case 'eth':
      return 'https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png';
    case 'matic':
      return 'https://s2.coinmarketcap.com/static/img/coins/200x200/3890.png';
    case 'avax':
      return 'https://s2.coinmarketcap.com/static/img/coins/200x200/5805.png';
    default:
      return 'https://s2.coinmarketcap.com/static/img/coins/200x200/1.png';
  }
};

/**
 * It takes a symbol as an argument and returns the description of the token if it exists
 * @param {Asset} symbol - Asset - The symbol of the token you want to get the description for.
 * @returns The description of the token.
 */
const getTokenDescriptionBySymbol = (symbol: Asset) => {
  const token = Tokens.tokens.find(
    (token) => token.token === symbol.toUpperCase()
  );
  if (!token) return;
  return token.description;
};

export {
  isWeb3WalletByAddress,
  formatWalletAddress,
  getWagmiInstanceByChainName,
  getTokenContractAddressBySymbolAndChain,
  getTokenIconBySymbol,
  getTokenDescriptionBySymbol,
  getChainNameById,
  getChainIdByName,
  getTestnetFromMainnet,
};
