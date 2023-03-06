import { Asset, Chain } from '@bloom-trade/types'
import { fCurrency, getTokenIconBySymbol } from '@bloom-trade/utilities'
import { Card, Stack, Typography } from '@mui/material'
import React from 'react'
import Label from '../Label'

export interface Props {
  token: Asset
  chain: Chain
  balance: string
}

const BalancesCards = (props: Props): JSX.Element => {
  return (
    <Stack px={1}>
      <Card
        sx={{
          p: 2,
          px: 4,
          width: 280,
        }}
      >
        <Stack direction='row' spacing={2}>
          <img src={getTokenIconBySymbol(props.token)} width={82} height={82} alt={props.token} />
          <Stack>
            <Stack direction='row' justifyContent={'space-between'} alignItems='center' spacing={2}>
              <Typography
                variant='body1'
                sx={{
                  fontWeight: 700,
                }}
              >
                {props.token.toUpperCase()}
              </Typography>
              <Label color='success'>ERC20</Label>
            </Stack>
            <Stack pt={2}>
              <Typography
                variant='body2'
                sx={{
                  color: 'text.secondary',
                }}
              >
                Current Balance
              </Typography>
              <Typography variant='body2'>{fCurrency(props.balance)}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}

export default BalancesCards
