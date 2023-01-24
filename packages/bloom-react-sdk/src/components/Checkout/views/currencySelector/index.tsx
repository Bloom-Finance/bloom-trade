import { StableCoin } from '@bloom-trade/types'
import { List, ListItem, ListItemIcon, Avatar, ListItemText } from '@mui/material'
import React from 'react'
import { getTokenDescriptionBySymbol, getTokenIconBySymbol } from '@bloom-trade/utilities'
export interface CurrencySelectorProps {
  amountLimit?: string
  balances: {
    currency: StableCoin
    amount: string
  }[]
  onSelect: (selectedToken: StableCoin) => void
}

const CurrencySelectorComponent = (props: CurrencySelectorProps): JSX.Element => {
  return (
    <List>
      {props.balances.map((balance) => {
        return (
          <ListItem
            secondaryAction={`$ ${balance.amount}`}
            key={balance.currency}
            onClick={() => props.onSelect(balance.currency)}
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
