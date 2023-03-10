import React from 'react'
import { SDKContext } from './context'
export interface SDKProps {
  apiKey: string
  testnet: boolean
  apiSecret: string
  children: React.ReactNode
}

const BloomSdk = (props: SDKProps): JSX.Element => {
  if (!props.apiKey) {
    throw new Error('Bloom SDK requires an API key. Please visit https://www.bloom.trade to get one.')
  }
  return (
    <SDKContext.Provider
      value={{
        apiSecret: props.apiSecret,
        apiKey: props.apiKey,
        testnet: props.testnet,
      }}
    >
      {props.children}
    </SDKContext.Provider>
  )
}

export default BloomSdk
