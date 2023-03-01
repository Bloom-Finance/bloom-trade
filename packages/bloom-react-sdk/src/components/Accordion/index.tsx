import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export interface Props {
  accordion: {
    summary: JSX.Element
    expandIcon?: JSX.Element
    details: JSX.Element
  }
}

const AccordionComponent = (props: Props): JSX.Element => {
  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={props.accordion.expandIcon || <ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          {props.accordion.summary}
        </AccordionSummary>
        <AccordionDetails>{props.accordion.details}</AccordionDetails>
      </Accordion>
    </>
  )
}

export default AccordionComponent
