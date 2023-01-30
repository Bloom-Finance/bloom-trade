import React from 'react'
import { StoryFn, ComponentMeta } from '@storybook/react'
import Loader, { SuccessProps } from '../success'

export default {
  title: 'Atoms/Loaders/Success',
  component: Loader,
  args: {
    color: 'blue',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Loader>

export const SimpleGreenSuccessVariation: StoryFn<SuccessProps> = (args) => {
  return <Loader {...args} />
}
