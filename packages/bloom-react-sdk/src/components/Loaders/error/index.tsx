import { Button, Stack } from '@mui/material'
import React from 'react'

export interface Props {
  text: string
  onRetry: () => void
}

const ErrorComponent = (props: Props): JSX.Element => {
  return (
    <Stack direction={'column'}>
      {props.text}
      <Button
        variant='contained'
        onClick={() => {
          props.onRetry()
        }}
      >
        Retry
      </Button>
    </Stack>
  )
}

export default ErrorComponent
