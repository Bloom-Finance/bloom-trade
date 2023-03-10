import React from 'react'

export const SDKContext = React.createContext<{
  apiKey: string
  apiSecret: string
  testnet: boolean
}>({
  apiKey: '',
  apiSecret: '',
  testnet: false,
})
