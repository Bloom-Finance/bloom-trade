import React from 'react'
import { SDKContext } from './context'
export interface SDKProps {
  apiKey: string
  testnet: boolean
  children: React.ReactNode
}

const BloomSdk = (props: SDKProps): JSX.Element => {
  if (!props.apiKey) {
    throw new Error('Bloom SDK requires an API key. Please visit https://www.bloom.trade to get one.')
  }
  return (
    <SDKContext.Provider
      value={{
        apiKey: props.apiKey,
        testnet: props.testnet,
      }}
    >
      {props.children}
    </SDKContext.Provider>
  )
}

export default BloomSdk
