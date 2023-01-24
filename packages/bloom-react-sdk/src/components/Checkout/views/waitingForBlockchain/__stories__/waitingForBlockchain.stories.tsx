import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import WaitingForBlockchain from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Waiting For Blockchain',
  component: WaitingForBlockchain,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof WaitingForBlockchain>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WaitingForBlockchain> = (args) => <WaitingForBlockchain {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  status: 'pending',
  msg: 'Test',
  txHash: '0xx',
  chain: 'avax',
}
