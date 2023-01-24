import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Checkout from '../index'
import { Button } from '@mui/material'
import CheckoutPreview from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Preview Checkout',
  component: CheckoutPreview,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CheckoutPreview>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CheckoutPreview> = (args) => <Checkout {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  destinationDescription: {
    image: 'https://avatars.githubusercontent.com/u/1378165?v=4',
    name: 'Alex Fiorenza',
  },
  orderId: '4f90d13a42',
  date: 1674568125845,
  total: {
    details: {
      items: [{ description: 'Flight for 1 person', amount: 150 }],
      taxes: [{ description: 'Tax', amount: 100 }],
    },
    amount: 250,
  },
  walletConnectButton: <Button variant='contained'>Connect</Button>,
}
