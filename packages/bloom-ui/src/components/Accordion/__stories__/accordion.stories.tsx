import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '../index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecule/Accordion',
  component: Accordion,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Accordion>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Accordion> = (args) => <Accordion {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  accordion: {
    summary: <div>Summary 1</div>,
    details: <div>Details 1</div>,
  },
}
