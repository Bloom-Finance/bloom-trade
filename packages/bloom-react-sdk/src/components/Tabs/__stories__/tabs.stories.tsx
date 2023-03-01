import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Tabs from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Tabs',
  component: Tabs,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Tabs>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  tabs: [
    {
      label: 'Tab 1',
      component: <div>Tab 1</div>,
    },
    {
      label: 'Tab 2',
      component: <div>Tab 2</div>,
    },
  ],
  indicatorColor: 'primary',
  textColor: 'primary',
}
