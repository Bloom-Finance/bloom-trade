import type { NextPage } from 'next';
import { Collector, BloomSdk } from '@bloom-trade/sdk';
const SandboxPage: NextPage = () => {
  return (
    <BloomSdk testnet={true} apiKey='14308be4f5' apiSecret='14308be4f5_SECRET'>
      <Collector
        order={{
          id: '123',
          orderId: '123',
          txHash: `0x123123123`,
          date: 12313123,
          total: {
            amount: 10,
          },
        }}
        onSuccess={() => {
          console.log('success');
        }}
        onError={() => {
          console.log('error');
        }}
      />
    </BloomSdk>
  );
};

export default SandboxPage;
