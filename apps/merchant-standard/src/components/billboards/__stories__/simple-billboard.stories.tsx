import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Stack } from "@mui/material";
import Image from "next/image";
import SimpleBillboard, { SimpleBillboardProps } from "../simple";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Molecule/Billboards/simple",
  component: SimpleBillboard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof SimpleBillboard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SimpleBillboard> = (args) => (
  <SimpleBillboard {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: "Hi Leonardo!",
  description:
    "All In One Place. Now, you can check all your assets and movements from one place. Connect your self custodial wallet with confidence. Always are you in control",
  color: "success",
  width: "613px",
  height: "230px",
  media: (
    <Stack width={155} height={111}>
      <Image
        src="/assets/analitics-green.svg"
        width={155}
        height={111}
        alt="analytics"
      />
    </Stack>
  ),
};
