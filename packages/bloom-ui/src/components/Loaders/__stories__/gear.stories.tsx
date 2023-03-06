import React from 'react'
import { StoryFn, ComponentMeta } from '@storybook/react'
import Loader, { GearsLoaderProps } from '../gears'

export default {
  title: 'Atoms/Loaders/Gear',
  component: Loader,
  args: {
    color: 'blue',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Loader>

export const GearGrayColor: StoryFn<GearsLoaderProps> = (args) => {
  return <Loader {...args} />
}
