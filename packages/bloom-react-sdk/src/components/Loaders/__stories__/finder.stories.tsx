import React from 'react'
import { StoryFn, ComponentMeta } from '@storybook/react'
import Loader, { FindLoaderProps } from '../find'

export default {
  title: 'Atoms/Loaders/Find',
  component: Loader,
  args: {
    color: 'blue',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Loader>

export const FindSimpleVariation: StoryFn<FindLoaderProps> = (args) => {
  return <Loader {...args} />
}
