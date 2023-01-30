import React from 'react'
import { StoryFn, ComponentMeta } from '@storybook/react'
import Loader, { SpinCircleSimpleProps } from '../spin-circles/simple'

export default {
  title: 'Atoms/Loaders/Spin Circle',
  component: Loader,
  args: {
    color: 'blue',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Loader>

export const SpinCircleSimple: StoryFn<SpinCircleSimpleProps> = (args) => {
  return <Loader {...args} />
}
