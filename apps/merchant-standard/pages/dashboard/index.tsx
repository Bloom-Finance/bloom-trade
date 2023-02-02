import type { NextPage } from "next";
import SecurePage from "../../src/components/layout/securedPage";

const Page: NextPage = () => {
  return (
    <SecurePage title="Dashboard" currentLink="overview">
      Alive
    </SecurePage>
  );
};

export default Page;
