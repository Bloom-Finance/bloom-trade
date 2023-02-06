import type { NextPage } from "next";
import SecuredPage from "../../src/components/layout/securedPage";
import InternalContainer from "../../src/components/layout/internalContainer";
import Statistics from "../../src/sections/payouts/statistics";
import PayOutTransactions from "../../src/sections/payouts/transactions";
import { Button, Stack } from "@mui/material";
import useTransactions from "../../src/hooks/useTransactions";
import { TransactionsStore } from "../../src/store/transactions.store";
import { useEffect } from "react";

const Page: NextPage = () => {
  const { refresh, fetching, weeklyIncome, weeklyOutcome } = useTransactions();
  const store = TransactionsStore.useState((s) => s.transactions);

  return (
    <SecuredPage title="Payouts" currentLink="payouts">
      <Stack spacing={2}>
        <Statistics income={weeklyIncome} outcome={weeklyOutcome} />
        <PayOutTransactions
          headListTransactions={[
            {
              id: "date",
              label: "Date",
            },
            {
              id: "from",
              label: "From",
            },
            {
              id: "to",
              label: "To",
            },
            {
              id: "amount",
              label: "Amount",
            },
            {
              id: "status",
              label: "Status",
            },
          ]}
          rowsListTransactions={[
            {
              id: "1",
              date: new Date().getTime().toString(),
              from: "0x1234567890",
              to: "0x1234567890",
              amount: 100,
              status: "pending",
            },
            {
              id: "2",
              date: new Date().getTime().toString(),
              from: "0x1234567890",
              to: "0x1234567890",
              amount: 200,
              status: "completed",
            },
            {
              id: "2",
              date: new Date().getTime().toString(),
              from: "0x1234567890",
              to: "0x1234567890",
              amount: 200,
              status: "completed",
            },
            {
              id: "2",
              date: new Date().getTime().toString(),
              from: "0x1234567890",
              to: "0x1234567890",
              amount: 200,
              status: "completed",
            },
            {
              id: "2",
              date: new Date().getTime().toString(),
              from: "0x1234567890",
              to: "0x1234567890",
              amount: 200,
              status: "completed",
            },
            {
              id: "2",
              date: new Date().getTime().toString(),
              from: "0x1234567890",
              to: "0x1234567890",
              amount: 200,
              status: "completed",
            },
          ]}
        />
      </Stack>
    </SecuredPage>
  );
};

export default Page;
