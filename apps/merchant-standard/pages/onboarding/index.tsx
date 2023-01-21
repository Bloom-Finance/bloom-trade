import type { NextPage } from "next";
import PersonalInfo from "../../src/sections/landing/PersonalInfo";
import { UserStore } from "../../src/store/user.store";
import Layout from "../../src/components/layout";

const OnBoarding: NextPage = () => {
  return (
    <Layout>
      <PersonalInfo />
    </Layout>
  );
};

export default OnBoarding;
