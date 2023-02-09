import type { NextPage } from "next";
import SecuredPage from "../../src/components/layout/securedPage";
import CardsList from "../../src/components/cardsList";

const Page: NextPage = () => {
  return (
    <SecuredPage title="My Wallets" subTitle="All your wallets in one place" currentLink="my-wallets">
      <CardsList />
    </SecuredPage>
  );
};

export default Page;
