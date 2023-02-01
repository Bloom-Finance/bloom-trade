import React from 'react'
import { StoryFn, ComponentMeta, Meta } from '@storybook/react'

import { NavigatorMenu, NavigatorMenuProps, NavigationOptions } from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Navigator',
  component: NavigatorMenu,
  args: {
    selected: 'overview',
    user: {
      userId: '1',
      displayName: 'John Doe',
      email: 'john@doe.com',
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as Meta<typeof NavigatorMenu>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const NavigatorFirstVariation: StoryFn<NavigatorMenuProps> = (args) => {
  return <NavigatorMenu {...args} />
}
