# Bloom SDK

Is a package entended to be used within your storefront to interact with the Bloom Trade API.

## Installation 🧵

```bash
npm install @bloom-trade/sdk stripe  @stripe/stripe-js @stripe/react-stripe-js
```

## Get Started

This package uses wagmi to interact with the blockchain alongside walletconnect to connect to your wallet.

Please refer to the [WalletConnect instalation](https://docs.walletconnect.com/2.0/web3modal/react/installation) and then comeback here.

#### Inject BloomSDK to your app 🪡

```javascript
import { BloomSDK } from '@bloom-trade/sdk';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
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
```

## Usage 📒

```javascript
import type { NextPage } from 'next';
import { Collector } from '@bloom-trade/sdk';
const SandboxPage: NextPage = () => {
  return (
    <Collector
      order={{
        id: '123',
        orderId: '123',
        date: 12313123,
        total: {
          amount: 100,
        },
      }}
      onSuccess={(receipt) => {
        console.log('success', receipt);
      }}
      onError={() => {
        console.log('error');
      }}
    />
  );
};

export default SandboxPage;
```
