import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Stack } from "@mui/material";
import Image from "next/image";
import Statistics, { StatisticsProps } from "../statistics";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Templates/Payouts/Statistics section",
  component: Statistics,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Statistics>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Statistics> = (args: StatisticsProps) => (
  <Statistics {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  income: 1000,
  outcome: 500,
  loading: false,
};
