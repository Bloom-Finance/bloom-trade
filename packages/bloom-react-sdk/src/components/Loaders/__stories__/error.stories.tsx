import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ErrorComponent from '../../Loaders/error'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Atoms/Error',
  component: ErrorComponent,
  args: {},
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ErrorComponent>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ErrorComponent> = (args) => <ErrorComponent {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  text: 'Test',
}
