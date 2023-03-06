import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import Loader, { SpinCircleSimpleProps } from '../spin-circles/simple'

export default {
  title: 'Atoms/Loaders/Spin Circle',
  component: Loader,
  args: {
    color: 'blue',
    animate: true,
    size: 'sm',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as Meta<SpinCircleSimpleProps>

export const SpinCircleSimple: StoryFn<SpinCircleSimpleProps> = (args) => {
  return <Loader {...args} />
}
