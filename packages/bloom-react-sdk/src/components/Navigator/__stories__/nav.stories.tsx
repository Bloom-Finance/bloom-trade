import React from 'react'
import { StoryFn, ComponentMeta, Meta } from '@storybook/react'

import { NavigatorMenu, NavigatorMenuProps, NavigationOptions } from '../index'

export const itemsNavigatorMenu = [
  {
    id: 'overview',
    icon: 'iconoir:stats-down-square',
    text: 'Overview',
    navigate: () => {
      console.log('overview')
    },
  },
  {
    id: 'my-wallets',
    icon: 'uiw:pay',
    text: 'My Wallets',

    navigate: () => {
      console.log('wallets')
    },
  },
  {
    id: 'payment-request',
    icon: 'ph:rocket',
    text: 'Payment Request',

    navigate: () => {
      console.log('payments')
    },
  },
  {
    id: 'payouts',
    icon: 'icon-park-outline:bitcoin',
    text: 'Payout',

    navigate: () => {
      console.log('payouts')
    },
  },
  {
    id: 'plugins-integrations',
    icon: 'clarity:plugin-outline-badged',
    text: 'Plugins',

    navigate: () => {
      console.log('plugins')
    },
  },
]

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Navigator',
  component: NavigatorMenu,
  args: {
    selected: 'overview',
    user: {
      userId: '1',
      displayName: 'John Doe',
      email: 'john@doe.com',
    },
    items: itemsNavigatorMenu,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as Meta<typeof NavigatorMenu>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const NavigatorFirstVariation: StoryFn<NavigatorMenuProps> = (args) => {
  return <NavigatorMenu {...args} />
}
