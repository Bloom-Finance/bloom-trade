import { BloomReact, useBloom } from '@bloom-trade/react-sdk';
import { Button } from '@mui/material';
import type { NextPage } from 'next';
import { authService } from '../src/services/auth.services';
import useSafe from '../../../packages/bloom-react-sdk/dist/esm/hooks/useSafe';

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
