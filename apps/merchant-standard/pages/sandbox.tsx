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
          amount: 250,
        },
        destination: {
          chain: 'polygon',
          address: '0x1145AE4E5bD546A485A0529faB0AC751c7709339',
          token: 'dai',
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
