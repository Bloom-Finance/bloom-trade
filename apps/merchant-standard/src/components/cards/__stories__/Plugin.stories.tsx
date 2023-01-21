import { Stack } from "@mui/material";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Label from "../../label";

import PlugInCard, { PlugInCardProps } from "../PlugIn";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Atoms/Cards/PlugIn",
  component: PlugInCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PlugInCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PlugInCard> = (args) => (
  <PlugInCard {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  brand: "circle",
  name: "Circle",
  text: "Circle is a payment processor that allows you to accept payments from customers in over 100 countries.",
  configureGoTo: "#",
  labels: (
    <Stack direction="row" spacing={1}>
      <Label color="success">Label1</Label>
      <Label color="info">Label1</Label>
    </Stack>
  ),
};
