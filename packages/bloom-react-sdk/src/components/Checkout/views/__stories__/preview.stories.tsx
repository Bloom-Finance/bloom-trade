import React from 'react'
import { StoryFn, ComponentStory, ComponentMeta } from '@storybook/react'

import Checkout, { PreviewProps } from '../preview/index'
import { Button } from '@mui/material'
import CheckoutPreview from '../preview'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Checkout/Preview',
  component: CheckoutPreview,
  args: {
    type: 'paymentRequest',
    token: 'dai',
    chain: 'eth',
    address: '0x123445',
    isConnected: true,
    orderId: '4f90d13a42',
    date: 1674568125845,
    total: {
      details: {
        items: [{ description: 'Flight for 1 person', amount: 150 }],
        taxes: [{ description: 'Tax', amount: 100 }],
      },
      amount: 250,
    },
    button: <Button variant='contained'>Connect</Button>,
    from: {
      chain: 'avax',
      address: '0x123445',
      token: 'usdt',
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CheckoutPreview>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CheckoutPreview> = (args) => <Checkout {...args} />

export const PreviewWithData: StoryFn<PreviewProps> = (args) => {
  return <CheckoutPreview {...args} />
}
