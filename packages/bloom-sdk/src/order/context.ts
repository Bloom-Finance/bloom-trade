import { Asset, Chain } from '@bloom-trade/types'
import React from 'react'

export const OrderContext = React.createContext<{
  type: 'crypto' | 'creditCard' | 'bankAccount'
  status: 'processing' | 'completed' | 'failed' | 'cancelled' | 'idle'
  txHash?: string
  chain?: Chain
  token?: Asset
}>({
  type: 'crypto',
  status: 'idle',
})
