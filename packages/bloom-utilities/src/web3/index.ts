import { StableCoin, Testnet, Chain } from '@bloom-trade/types';
import {
  goerli,
  polygonMumbai,
  avalancheFuji,
  mainnet,
  polygon,
  avalanche,
} from 'wagmi/chains';
import Tokens from '../data/tokens.json' assert { type: "json" };;
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

export {
  isWeb3WalletByAddress,
  formatWalletAddress,
  getWagmiInstanceByChainName,
  getTokenContractAddressBySymbolAndChain,
};
