import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Checkout from '../index'
import { Button } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Organism/Checkout',
  component: Checkout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Checkout>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Checkout> = (args) => <Checkout {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  order: {
    id: '4f90d13a42',
    orderId: '4f90d13a42',
    date: 1674568125845,
    total: {
      details: {
        items: [{ description: 'Flight for 1 person', amount: 150 }],
        taxes: [{ description: 'Tax', amount: 100 }],
      },
      amount: 250,
    },
    destination: {
      chain: 'eth',
      address: '0x1145AE4E5bD546A485A0529faB0AC751c7709339',
      token: 'dai',
      description: {
        name: 'Alex Fiorenza',
        image: 'https://avatars.githubusercontent.com/u/1378165?v=4',
      },
    },
  },
  walletConnectButton: <Button variant='contained'>Connect</Button>,
}
