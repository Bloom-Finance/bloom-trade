import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import BalancesCards from '../balances'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Cards/Balances',
  component: BalancesCards,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof BalancesCards>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BalancesCards> = (args) => <BalancesCards {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  token: 'dai',
  chain: 'eth',
  balance: '1000',
}
