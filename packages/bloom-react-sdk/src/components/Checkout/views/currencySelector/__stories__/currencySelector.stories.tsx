import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import CurrencySelector from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Currency Selector ',
  component: CurrencySelector,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CurrencySelector>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CurrencySelector> = (args) => <CurrencySelector {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  balances: [
    { currency: 'dai', amount: '1000' },
    { currency: 'usdc', amount: '1000' },
    { currency: 'usdt', amount: '1000' },
  ],
  onSelect: (selected) => {
    console.log('selected', selected)
  },
}
