import React from 'react'
import { StoryFn, ComponentStory, ComponentMeta } from '@storybook/react'
import CurrencySelector, { CurrencySelectorProps } from '../currencySelector'

export const currencyBalancesData = {
  balances: [
    { currency: 'dai', amount: '1000' } as any,
    { currency: 'usdc', amount: '100' } as any,
    { currency: 'usdt', amount: '1000' } as any,
  ],
  onSelect: (selected: any) => {
    console.log('selected', selected)
  },
  amountLimit: '1000',
}

export default {
  title: 'Molecule/Currency Selector ',
  component: CurrencySelector,
  args: {
    ...currencyBalancesData,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CurrencySelector>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const CurrencySelectorWithDataVariation: StoryFn<CurrencySelectorProps> = (args) => {
  return <CurrencySelector {...args} />
}
