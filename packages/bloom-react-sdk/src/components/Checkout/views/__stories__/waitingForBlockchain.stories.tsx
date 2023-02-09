import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import WaitingForBlockchain from '../waitingForBlockchain'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Checkout/Waiting For Blockchain',
  component: WaitingForBlockchain,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof WaitingForBlockchain>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WaitingForBlockchain> = (args) => <WaitingForBlockchain {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  txHash: '0x6e9286dd5957142b0deb0ae1cabcc15d07384c7dd4a57e2d56369a865b347453',
  chain: 'goerli',
}
