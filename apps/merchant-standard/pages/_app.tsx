import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { DefaultTheme } from "@bloom-trade/themes";
import AOS from "aos";
import "aos/dist/aos.css";
import "../src/styles/global.css";
import { BloomReact } from "@bloom-trade/react-sdk";
import createEmotionCache from "../src/createEmotionCache";
import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli, polygon, polygonMumbai, avalancheFuji, avalanche } from "wagmi/chains";
import { authService } from "../src/services/auth.services";

const chains = [mainnet, polygon, goerli, polygonMumbai, avalancheFuji, avalanche];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({
    projectId: process.env.WALLETCONNECT_PROJECTID as string,
  }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    appName: "Bloom",
    chains,
    projectId: process.env.WALLETCONNECT_PROJECTID as string,
  }),
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
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Bloom Standard Version</title>
      </Head>
      <ThemeProvider theme={DefaultTheme}>
        <CssBaseline />
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
        <Web3Modal projectId={process.env.WALLETCONNECT_PROJECTID as string} ethereumClient={ethereumClient} privacyPolicyUrl="https://www.bloom.trade/legal/terms" termsOfServiceUrl="https://example.com/terms-and-conditions" />
      </ThemeProvider>
    </CacheProvider>
  );
}
