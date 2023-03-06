import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import { UserComponent, UserComponentProps } from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Atoms/User',
  component: UserComponent,
  args: {
    size: 'sm',
    user: {
      id: '1',
      displayName: 'John Doe',
      email: 'john@doe.com',
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as Meta<typeof UserComponent>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const UserFirstVariation: StoryFn<UserComponentProps> = (args) => {
  return <UserComponent {...args} />
}
