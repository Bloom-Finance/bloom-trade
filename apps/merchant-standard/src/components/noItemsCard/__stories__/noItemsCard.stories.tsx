import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import NoItemsCard, { NoItemsCardsProps } from "../index";
import { Button } from "@mui/material";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Organism/No Items Card",
  component: NoItemsCard,
} as ComponentMeta<typeof NoItemsCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NoItemsCard> = (args) => (
  <NoItemsCard {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: "No Items",
  description: "You have no items in your cart",
  actionSection: (
    <Button variant="contained" color="primary">
      Go to store
    </Button>
  ),
};
