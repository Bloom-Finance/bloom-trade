import type { NextPage } from 'next';
import { Checkout, useBloom } from '@bloom-trade/react-sdk';
const SandboxPage: NextPage = () => {
  const { Connect } = useBloom();
  return (
    <Checkout
      order={{
        id: '4f90d13a42',
        orderId: '4f90d13a42',
        date: 1674568125845,
        total: {
          details: {
            items: [{ description: 'Flight for 1 person', amount: 150 }],
            taxes: [{ description: 'Tax', amount: 100 }],
          },
          amount: 2,
        },
        destination: {
          chain: 'eth',
          address: '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
          token: 'usdc',
          description: {
            name: 'Alex Fiorenza',
            image: 'https://avatars.githubusercontent.com/u/1378165?v=4',
          },
        },
      }}
      walletConnectButton={<Connect />}
    />
  );
};

export default SandboxPage;
