import { Button, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import Locked from '../../../assets/locked'
import Iconify from '../../Iconify'

export interface Props {
  isConnected?: boolean
  walletConnectButton?: JSX.Element
  onSign?: () => void
}

const VaultDetailLocked = (props: Props): JSX.Element => {
  return (
    <Stack spacing={2} justifyContent='center' alignItems='center'>
      <Locked />
      <Typography>This vault is blocked, please connect and sign the transaction to unlock it.</Typography>
      {!props.isConnected ? (
        props.walletConnectButton
      ) : (
        <Button
          variant='outlined'
          onClick={() => {
            props.onSign && props.onSign()
          }}
          startIcon={<Iconify icon='material-symbols:lock-open-outline' />}
        >
          Open
        </Button>
      )}
    </Stack>
  )
}

export default VaultDetailLocked
