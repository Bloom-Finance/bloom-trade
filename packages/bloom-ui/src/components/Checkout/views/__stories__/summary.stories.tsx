import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Summary from '../summary/index'
import { Button } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Checkout/Summary',
  component: Summary,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Summary>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Summary> = (args) => <Summary {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  actions: {
    button: <Button variant='contained'>Continue</Button>,
  },
  order: {
    id: '4f90d13a42',
    from: {
      chain: 'polygon',
      address: '0x1145AE4E5bD546A485A0529faB0AC751c7709339',
      token: 'usdc',
    },
    orderId: '4f90d13a42',
    date: 1674568125845,
    total: {
      details: {
        items: [{ description: 'Flight for 1 person', amount: 150 }],
        taxes: [{ description: 'Tax', amount: 100 }],
      },
      amount: 2,
    },
    destination: {
      chain: 'polygon',
      address: '0x1145AE4E5bD546A485A0529faB0AC751c7709339',
      token: 'dai',
      description: {
        name: 'Alex Fiorenza',
        image: 'https://avatars.githubusercontent.com/u/14966470?v=4',
      },
    },
  },
  testnet: true,
}
