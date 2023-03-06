import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import WaitingForApproval from '../waitingForApproval'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Checkout/Waiting For Approval',
  component: WaitingForApproval,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof WaitingForApproval>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WaitingForApproval> = (args) => <WaitingForApproval {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  type: 'tokenApproval',
}
