import React from 'react'
import { StoryFn, ComponentMeta } from '@storybook/react'
import Loader, { SonarOneCirclePros } from '../sonar/one-circle'
import SonarTwoCircle, { SonarTwoCirclePros } from '../sonar/two-circles-thin'
export default {
  title: 'Atoms/Loaders/Sonar',
  component: Loader,
  args: {
    color: 'blue',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Loader>

export const SonarOneCircleVariation: StoryFn<SonarOneCirclePros> = (args) => {
  return <Loader {...args} />
}

export const SonarTwoCircleThinVariation: StoryFn<SonarTwoCirclePros> = (args) => {
  return <SonarTwoCircle {...args} />
}
