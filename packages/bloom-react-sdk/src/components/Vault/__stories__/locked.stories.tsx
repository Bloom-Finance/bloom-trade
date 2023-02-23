import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import VaultDetailLocked from '../detail/locked'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Vault locked',
  component: VaultDetailLocked,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof VaultDetailLocked>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof VaultDetailLocked> = (args) => <VaultDetailLocked {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {}
