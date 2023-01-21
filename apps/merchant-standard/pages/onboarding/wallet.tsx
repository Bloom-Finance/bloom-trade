import React from 'react';
import type { NextPage } from 'next';
import WalletInfo from '../../src/sections/landing/WalletInfo';
import Layout from '../../src/components/layout';
import WalletSupported from '../../src/sections/landing/WalletSupported';

const Wallet: NextPage = () => {
  return (
    <Layout>
      <WalletInfo />
      <WalletSupported />
    </Layout>
  );
};

export default Wallet;
