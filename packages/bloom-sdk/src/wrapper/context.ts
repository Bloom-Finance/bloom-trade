import React from 'react'

export const SDKContext = React.createContext<{
  apiKey: string
  testnet: boolean
}>({
  apiKey: '',
  testnet: false,
})
