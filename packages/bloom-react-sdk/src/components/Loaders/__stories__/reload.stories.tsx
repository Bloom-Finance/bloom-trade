import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import Reload, { ReloadProps } from '../reload'

export default {
  title: 'Atoms/Loaders/Reload',
  component: Reload,
  args: {
    color: 'blue',
    animate: true,
    size: 'sm',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as Meta<ReloadProps>

export const ReloadSimpleVariation: StoryFn<ReloadProps> = (args) => {
  return <Reload {...args} />
}
