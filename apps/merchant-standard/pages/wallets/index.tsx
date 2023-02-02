import type { NextPage } from "next";
import SecuredPage from "../../src/components/layout/securedPage";
import useResponsive from "../../src/hooks/useResponsive";
import CardsList from "../../src/components/cardsList";
import InternalContainer from "../../src/components/layout/internalContainer";
const Page: NextPage = () => {
  return (
    <SecuredPage title="My Wallets" currentLink="my-wallets">
      <CardsList />
    </SecuredPage>
  );
};

export default Page;
