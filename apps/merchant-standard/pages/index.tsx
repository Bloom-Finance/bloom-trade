import type { NextPage } from 'next';

import { Web3Auth } from '@web3auth/modal';
import withPreckUser from '../src/controls/hoc/SignIn';
import Hero from '../src/sections/landing/Hero';
import Layout from '../src/components/layout';

interface Props {
  hasBloomSession: boolean;
  web3Auth: Web3Auth;
  hasWeb3AuthSession: boolean;
}
const Index: NextPage<Props> = (props) => {
  return (
    <Layout>
      <Hero />
    </Layout>
  );
};

export default withPreckUser(Index);
