import { Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import Success from '../../../Loaders/success'

export interface SuccessCardProps {
  size?: 'small' | 'medium' | 'large'
}

const SuccessCard = (props: SuccessCardProps): JSX.Element => {
  const theme = useTheme()
  return (
    <Stack direction='row' alignItems='center' justifyContent='center'>
      <Stack
        width={'100%'}
        sx={{
          maxWidth: '500px',
        }}
      >
        <Success />
        <Stack
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          spacing={1}
          py={3}
          width={'100%'}
          sx={{
            borderBottom: '1px solid #E5E5E5',
          }}
        >
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            Payment successfully
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 400, color: theme.palette.text.disabled }}>
            transaction id: 0x...
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default SuccessCard
