import React from 'react'
import { StoryFn, ComponentStory, ComponentMeta } from '@storybook/react'

import WalletComponent, { WalletProps } from '../index'
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Wallet',
  component: WalletComponent,
  args: {
    loadingBalance: false,
    wallet: {
      address: '0x1145AE4E5bD546A485A0529faB0AC751c7709339',
      brand: 'mm',
      chains: ['ETH'],
      currency: 'USDT',
      id: '10a3b37d3f',
      isPrincipal: true,
      owner: 'c8b94e4f2c',
      balance: {
        amount: '100',
        detail: [
          {
            address: '0x1145AE4E5bD546A485A0529faB0AC751c7709339',
            balance: '50',
            chain: 'ETH',
            provider: 'etherscan',
            currency: 'USDT',
          },
          {
            address: '0x1145AE4E5bD546A485A0529faB0AC751c7709339',
            balance: '50',
            chain: 'POLYGON',
            provider: 'polygonscan',
            currency: 'USDT',
          },
        ],
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof WalletComponent>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WalletComponent> = (args) => <WalletComponent {...args} />

export const SingleWallet: StoryFn<WalletProps> = (args) => {
  return <WalletComponent {...args} />
}
