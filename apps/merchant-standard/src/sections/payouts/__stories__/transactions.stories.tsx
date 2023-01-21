import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import PayOutTransactions, { PayOutTransactionsProps } from "../transactions";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Templates/Payouts/Transactions section",
  component: PayOutTransactions,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PayOutTransactions>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PayOutTransactions> = (
  args: PayOutTransactionsProps
) => <PayOutTransactions {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  headListTransactions: [
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
  ],
  rowsListTransactions: [
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
  ],
};
