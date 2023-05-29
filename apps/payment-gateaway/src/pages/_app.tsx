import { AppProps } from 'next/app';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { BloomSdk } from '@bloom-trade/sdk';
const chains = [arbitrum, mainnet, polygon];
const projectId = '9e5adb44269734cce6e58c28e7b49618';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <BloomSdk
          testnet={true}
          apiKey='YOUR_BLOOM_API_KEY'
          apiSecret='YOUR_BLOOM_API_SECRET'
        >
          <Component {...pageProps} />;
        </BloomSdk>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
