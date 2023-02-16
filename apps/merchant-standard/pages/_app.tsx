import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { DefaultTheme } from '@bloom-trade/themes';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../src/styles/global.css';
import { BloomReact } from '@bloom-trade/react-sdk';
import createEmotionCache from '../src/createEmotionCache';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import {
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  avalancheFuji,
  avalanche,
} from 'wagmi/chains';

const chains = [
  mainnet,
  polygon,
  goerli,
  polygonMumbai,
  avalancheFuji,
  avalanche,
];
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

// Wagmi client
const { provider, chains: myChains } = configureChains(chains, [
  alchemyProvider({ apiKey: process.env.ALCHEMY_ID as string }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  React.useEffect(() => {
    AOS.init();
  }, []);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <title>Bloom Standard Version</title>
      </Head>
      <ThemeProvider theme={DefaultTheme}>
        <CssBaseline />
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
        <Web3Modal
          ethereumClient={ethereumClient}
          privacyPolicyUrl='https://www.bloom.trade/legal/terms'
          termsOfServiceUrl='https://example.com/terms-and-conditions'
          projectId={process.env.WALLETCONNECT_PROJECTID as string}
        />
      </ThemeProvider>
    </CacheProvider>
  );
}
