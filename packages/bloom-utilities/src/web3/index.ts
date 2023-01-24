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
function isWeb3WalletByAddress(address: string) {
  if (address.startsWith('0x')) {
    return true;
  }
  return false;
}
const formatWalletAddress = (address: string): string => {
  if (!address) return '';
  if (address.startsWith('0x')) {
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  return address.slice(0, 6) + '...' + address.slice(-4);
};

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
};
