import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import SuccessCard from '../success'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Checkout/Success Simple',
  component: SuccessCard,
  args: {},
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof SuccessCard>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SuccessCard> = (args) => <SuccessCard {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {}
