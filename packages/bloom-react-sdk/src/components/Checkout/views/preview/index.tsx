/* eslint-disable react/jsx-key */
import { Avatar, Card, CardActions, CardContent, Stack, Typography } from '@mui/material'
import React from 'react'
import { fDate } from '@bloom-trade/utilities'
export interface Props {
  walletConnectButton: JSX.Element
  orderId: string
  date: number
  destinationDescription?: {
    name?: string
    image?: string
  }
  total: {
    details?: {
      items?: {
        description: string
        amount: number
      }[]
      taxes?: {
        description: string
        amount: number
      }[]
    }
    amount: number
  }
}

const PreviewComponent = (props: Props): JSX.Element => {
  return (
    <Card>
      <CardContent>
        <Stack>
          {props.destinationDescription && (
            <Stack direction={'row'} alignItems={'center'}>
              <Avatar src={props.destinationDescription.image}></Avatar>
              <Typography variant='body2'>{props.destinationDescription.name}</Typography>
            </Stack>
          )}
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant='caption'>Order #{props.orderId}</Typography>
          <Typography variant='caption'>{fDate(props.date, 'L')}</Typography>
        </Stack>
        {props.total.details && (
          <Stack direction={'column'} justifyContent={'space-between'}>
            {props.total.details.items &&
              props.total.details.items.map((item) => {
                return (
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography variant='body2'>{item.description}</Typography>
                    <Typography variant='body2'>${item.amount}</Typography>
                  </Stack>
                )
              })}
            {props.total.details.taxes &&
              props.total.details.taxes.map((tax) => {
                return (
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography variant='body2'>{tax.description}</Typography>
                    <Typography variant='body2'>${tax.amount}</Typography>
                  </Stack>
                )
              })}
          </Stack>
        )}
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant='body2'>Total</Typography>
          <Typography variant='body2'>${props.total.amount}</Typography>
        </Stack>
      </CardContent>
      <CardActions>{props.walletConnectButton}</CardActions>
    </Card>
  )
}

export default PreviewComponent
