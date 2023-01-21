import type { NextPage } from 'next';
import SecuredPage from '../../src/components/layout/securedPage';
import useResponsive from '../../src/hooks/useResponsive';
import CardsList from '../../src/components/cardsList';
import InternalContainer from '../../src/components/layout/internalContainer';
const Page: NextPage = () => {
  return (
    <SecuredPage>
      <InternalContainer title='My Wallets'>
        <CardsList />
      </InternalContainer>
    </SecuredPage>
  );
};

export default Page;
