import type { NextPage } from 'next';
import { Collector, BloomSdk } from '@bloom-trade/sdk';
const SandboxPage: NextPage = () => {
  return (
    <BloomSdk testnet={true} apiKey='14308be4f5' apiSecret='14308be4f5_SECRET'>
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
    </BloomSdk>
  );
};

export default SandboxPage;
