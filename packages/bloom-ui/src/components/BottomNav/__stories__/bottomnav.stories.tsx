import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { BottomNav, BottomNavProps } from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Navigator',
  component: BottomNav,
  args: {},
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as Meta<BottomNavProps>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const BottomNavigatorFirstVariation: StoryFn<BottomNavProps> = (args) => {
  return <BottomNav {...args} />
}
