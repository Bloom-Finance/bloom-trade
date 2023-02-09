import { Typography } from "@mui/material";
import type { NextPage } from "next";
import SecuredPage from "../../src/components/layout/securedPage";

const Page: NextPage = () => {
  return (
    <div>
      <SecuredPage title="Payment Request" currentLink="payment-request">
        <Typography>Create your payment Request</Typography>
      </SecuredPage>
    </div>
  );
};

export default Page;
