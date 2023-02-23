import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import AddressInformation from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Atoms/Address information',
  component: AddressInformation,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AddressInformation>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddressInformation> = (args) => <AddressInformation {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  address: '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
  chain: 'eth',
}
