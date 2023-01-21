import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Stack } from "@mui/material";
import Image from "next/image";
import QuickTransfer, { QuickTransferProps } from "../index";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Molecule/Payout/Quick Transfer",
  component: QuickTransfer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof QuickTransfer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof QuickTransfer> = (
  args: QuickTransferProps
) => <QuickTransfer {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};
