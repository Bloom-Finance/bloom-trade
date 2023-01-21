import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ButtonPlayVideo, { ButtonPlayVideoProps } from "../index";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Atoms/Buttons/Play Video",
  component: ButtonPlayVideo,
} as ComponentMeta<typeof ButtonPlayVideo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ButtonPlayVideo> = (args) => (
  <ButtonPlayVideo {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  darkMode: false,
  secondsToReproduce: 30,
  label: "Play Video",
};
