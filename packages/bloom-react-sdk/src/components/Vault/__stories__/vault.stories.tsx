import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Table from '../index'
import { Typography } from '@mui/material'
import VaultComponent from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Vault',
  component: VaultComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof VaultComponent>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof VaultComponent> = (args) => <VaultComponent {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  address: '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
  owners: [
    '0x1145AE4E5bD546A485A0529faB0AC751c7709339',
    '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
    '0x460ebc43280F9a256a94145DA36778e83E09Fc98',
  ],
  chain: 'goerli',
  qrCodeLogoImage: 'https://merchant.bloom.trade/apple-touch-icon.png',
  balance: [
    {
      asset: 'usdt',
      amount: '3',
    },
    {
      asset: 'dai',
      amount: '4',
    },
    {
      asset: 'usdc',
      amount: '300',
    },
  ],
}
