import React from 'react'
import { StoryFn, ComponentMeta } from '@storybook/react'
import { LoaderBalanceSkeletonProps, LoaderBalanceSkeleton } from '../balance'

export default {
  title: 'Atoms/Loaders/Skeleton',
  component: LoaderBalanceSkeleton,
  args: {},
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LoaderBalanceSkeleton>

export const BalanceVariation: StoryFn<LoaderBalanceSkeletonProps> = (args) => {
  return <LoaderBalanceSkeleton {...args} />
}
