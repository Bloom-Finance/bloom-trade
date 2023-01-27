import { StableCoin } from '@bloom-trade/types'
import { List, ListItem, ListItemIcon, Avatar, ListItemText, Stack } from '@mui/material'
import React from 'react'
import { getTokenDescriptionBySymbol, getTokenIconBySymbol } from '@bloom-trade/utilities'
import useResponsive from '../../../../hooks/useResponsive'

export interface CurrencySelectorProps {
  amountLimit?: string
  balances: {
    currency: StableCoin
    amount: string
  }[]
  onSelect: (selectedToken: StableCoin) => void
}

const CurrencySelectorComponent = (props: CurrencySelectorProps): JSX.Element => {
  const { amountLimit } = props
  const mdUp = useResponsive('up', 'md')
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: mdUp ? '600px' : '340px',
      }}
    >
      {props.balances.map((balance) => {
        return (
          <ListItem
            secondaryAction={`$ ${balance.amount}`}
            key={balance.currency}
            onClick={() => props.onSelect(balance.currency)}
            sx={{
              background:
                amountLimit && Number(amountLimit) > Number(balance.amount) ? 'rgba(162, 0, 29, 0.2)' : 'none',
            }}
          >
            <ListItemIcon>
              <Avatar src={getTokenIconBySymbol(balance.currency)} alt={balance.currency} />
            </ListItemIcon>
            <ListItemText
              primary={balance.currency.toUpperCase()}
              secondary={getTokenDescriptionBySymbol(balance.currency)}
            />
          </ListItem>
        )
      })}
    </List>
  )
}

export default CurrencySelectorComponent
