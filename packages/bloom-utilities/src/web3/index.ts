/* eslint-disable @typescript-eslint/no-var-requires */
import Bloom, {
  StableCoin,
  Testnet,
  Chain,
  Asset,
  Scanners,
} from '@bloom-trade/types';
import {
  goerli,
  polygonMumbai,
  avalancheFuji,
  mainnet,
  polygon,
  avalanche,
} from 'wagmi/chains';
import Tokens from '../data/tokens.json';
import Contracts from '../data/bloomContracts.json';
import Abis from '../data/abis.json';
import Web3 from 'web3';
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
 * @returns Chain | Testnet
 */
const getChainNameById = (id: number): Chain | Testnet => {
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
      throw new Error('Invalid chain ID');
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
const getTokenContractMetadataBySymbolAndChain = (
  symbol: StableCoin,
  chain: Chain | Testnet
):
  | {
      address: string;
      decimals: number;
    }
  | undefined => {
  const foundSymbol = Tokens.tokens.find(
    (asset) => asset.token === symbol.toUpperCase()
  );
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
      return 'https://s2.coinm1rketcap.com/static/img/coins/200x200/1.png';
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

/**
 * It returns the contract address for a given chain and type
 * @param {Chain} chain - Chain - The chain you want to get the contract address for.
 * @param {'transfers' | 'swapper' | 'receipts'} type - 'transfers' | 'swapper'
 * @param [params] - {
 * @returns The contract address for the chain and type specified.
 */

const getBloomContractsByChain = (
  chain: Chain | Testnet,
  type: 'transfers' | 'swapper' | 'receipts'
): string | `0x${string}` => {
  let isTestnet = false;
  if (chain === 'fuji' || chain === 'mumbai' || chain === 'goerli') {
    isTestnet = true;
  }
  const chainContracts =
    Contracts[
      chain === 'fuji'
        ? 'avax'
        : chain === 'mumbai'
        ? 'polygon'
        : chain === 'goerli'
        ? 'eth'
        : chain
    ];
  return chainContracts[isTestnet ? 'testnet' : 'mainnet'][type];
};

/**
 * It takes a token value and the number of decimals and returns the token value in its smallest unit
 * @param {string} value - The amount of tokens you want to convert.
 * @param {number} decimals - The number of decimals the token uses.
 * @returns The converted token value.
 */
const convertTokenToDecimalsUnit = (value: string, decimals: number) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  return web3.utils
    .toBN(value)
    .div(web3.utils.toBN(10 ** decimals))
    .toString();
};

/**
 * It converts a decimal value to a token value
 * @param {string} value - The value to convert.
 * @param {number} decimals - The number of decimals the token uses.
 * @returns The value of the token in wei.
 */
const convertDecimalsUnitToToken = (value: string, decimals: number) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  return web3.utils
    .toBN(value)
    .mul(web3.utils.toBN(10 ** decimals))
    .toString();
};

/**
 * It returns a URL to a blockchain explorer for a given address and chain
 * @param {string} address - The address of the wallet you want to scan.
 * @param {Chain | Testnet} chain - The chain you want to use.
 * @returns A string
 */
const getWalletBlockchainExplorer = (
  address: string,
  chain: Chain | Testnet
) => {
  switch (chain) {
    case 'avax':
      return `${Scanners.avax}/address/${address}`;
    case 'eth':
      return `${Scanners.eth}/address/${address}`;
    case 'polygon':
      return `${Scanners.polygon}/address/${address}`;
    case 'goerli':
      return `${Scanners.goerli}/address/${address}`;
    case 'mumbai':
      return `${Scanners.mumbai}/address/${address}`;
    case 'fuji':
      return `${Scanners.fuji}/address/${address}`;
    default:
      return `${Scanners.eth}/address/${address}`;
  }
};
const getBlockchainExplorerName = (chain: Chain | Testnet) => {
  switch (chain) {
    case 'avax':
      return 'Snowtrace';
    case 'eth':
      return 'Etherscan';
    case 'polygon':
      return 'Polygonscan';
    case 'goerli':
      return 'Etherscan (Goerli)';
    case 'mumbai':
      return 'Polygonscan (Mumbai)';
    case 'fuji':
      return 'Snowtrace (Fuji)';
    default:
      return 'Etherscan';
  }
};
/**
 * It returns the ABI for the `Transfers` contract
 * @returns The Abis.transfers object.
 */

const getTransfersAbi = () => {
  return Abis.transfers;
};

/**
 * It returns the ABI for the Swapper contract
 * @returns the swapper abi.
 */
const getSwapperAbi = () => {
  return Abis.swapper;
};

const getTxDetailsBlockchainExplorer = (
  txHash: string,
  chain: Chain | Testnet
) => {
  switch (chain) {
    case 'avax':
      return `${Scanners.avax}/tx/${txHash}`;
    case 'eth':
      return `${Scanners.eth}/tx/${txHash}`;
    case 'polygon':
      return `${Scanners.polygon}/tx/${txHash}`;
    case 'goerli':
      return `${Scanners.goerli}/tx/${txHash}`;
    case 'mumbai':
      return `${Scanners.mumbai}/tx/${txHash}`;
    case 'fuji':
      return `${Scanners.fuji}/tx/${txHash}`;
    default:
      return `${Scanners.eth}/tx/${txHash}`;
  }
};

const getGnosisService = (chain: Chain | 'goerli') => {
  switch (chain) {
    case 'goerli':
      return Bloom.Safe.SafeService.testnet;
    case 'eth':
      return Bloom.Safe.SafeService.ethereum;
    case 'polygon':
      return Bloom.Safe.SafeService.polygon;
    case 'avax':
      return Bloom.Safe.SafeService.avalanche;
    default:
      return Bloom.Safe.SafeService.ethereum;
  }
};

const getMainnetFromTestnet = (chain: Testnet) => {
  switch (chain) {
    case 'goerli':
      return 'eth';
    case 'mumbai':
      return 'polygon';
    case 'fuji':
      return 'avax';
    default:
      return 'eth';
  }
};

const isTestnet = (chain: number | Chain | Testnet) => {
  let chainName = chain;
  if ((chain as any) instanceof Number) {
    chainName = getChainNameById(chain as number);
  }
  if (
    chainName === 'fuji' ||
    chainName === 'mumbai' ||
    chainName === 'goerli'
  ) {
    return true;
  } else {
    return false;
  }
};

export {
  isWeb3WalletByAddress,
  formatWalletAddress,
  getWagmiInstanceByChainName,
  getTokenContractMetadataBySymbolAndChain,
  getTokenIconBySymbol,
  getTokenDescriptionBySymbol,
  getChainNameById,
  getChainIdByName,
  getTestnetFromMainnet,
  getBloomContractsByChain,
  convertDecimalsUnitToToken,
  convertTokenToDecimalsUnit,
  getWalletBlockchainExplorer,
  getTransfersAbi,
  getSwapperAbi,
  getBlockchainExplorerName,
  getTxDetailsBlockchainExplorer,
  getGnosisService,
  getMainnetFromTestnet,
  isTestnet,
};
