import { BloomReact, useBloom } from '@bloom-trade/react-sdk';
import type { NextPage } from 'next';
import { authService } from '../src/services/auth.services';

const SandboxPage: NextPage = () => {
  const { Connect } = useBloom();

  return (
    <BloomReact
      credentials={authService.getToken() as string}
      useTestnet={process.env.MODE === 'DEV' ? true : false}
    >
      <>
        <Connect />
      </>
    </BloomReact>
  );
};

export default SandboxPage;
