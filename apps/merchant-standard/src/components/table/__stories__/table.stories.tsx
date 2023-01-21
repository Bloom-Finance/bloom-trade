import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Table, { TableProps } from "../index";
import { Typography } from "@mui/material";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Atoms/Table/Simple Table",
  component: Table,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Table>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: "My Table",
  head: [
    {
      id: "name",
      label: "Name",
      width: "50px",
    },
    {
      id: "age",
      label: "Age",
      width: "10px",
    },
  ],
  rows: [
    {
      id: "1",
      components: [
        <Typography variant="body1">Leoanrdo</Typography>,
        <Typography variant="body1">25</Typography>,
      ],
    },
    {
      id: "2",
      components: [
        <Typography variant="body1">Alex</Typography>,
        <Typography variant="body1">25</Typography>,
      ],
    },
  ],
};
