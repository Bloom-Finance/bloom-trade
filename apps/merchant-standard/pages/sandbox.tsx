import type { NextPage } from 'next';
import { Connect, useBloom } from '@bloom-trade/react-sdk';
import SecuredPage from '../src/components/layout/securedPage';

const SandboxPage: NextPage = () => {
  const { Transfer } = useBloom({
    useTestnet: {
      testnet: process.env.MODE === 'DEV' ? true : false,
      chain: 'goerli',
    },
  });
  return (
    <SecuredPage>
      <Connect />
      <button
        onClick={() => {
          Transfer();
        }}
      >
        Test
      </button>
    </SecuredPage>
  );
};

export default SandboxPage;
