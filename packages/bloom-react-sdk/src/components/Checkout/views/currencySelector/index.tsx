import { StableCoin } from '@bloom-trade/types'
import React from 'react'

export interface CurrencySelectorProps {
  amountLimit?: string
  balances: {
    currency: StableCoin
    amount: string
  }[]
  onSelect: (selectedToken: StableCoin) => void
}

const CurrencySelectorComponent = (props: CurrencySelectorProps): JSX.Element => {
  console.log(props)
  return <div>Alive</div>
}

export default CurrencySelectorComponent
