import type { NextPage } from 'next';
import { Checkout, BloomSdk } from '@bloom-trade/sdk';
const SandboxPage: NextPage = () => {
  return (
    <BloomSdk testnet={true} apiKey='14308be4f5'>
      <Checkout />
    </BloomSdk>
  );
};

export default SandboxPage;
