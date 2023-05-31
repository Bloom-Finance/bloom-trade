import React from 'react'
import { SDKContext } from './context'
export interface SDKProps {
  apiUrl: string
  test: boolean
  children: React.ReactNode
}

const BloomSdk = (props: SDKProps): JSX.Element => {
  if (!props.apiUrl) {
    throw new Error('Bloom SDK requires an API key. Please visit https://www.bloom.trade to get one.')
  }
  return (
    <SDKContext.Provider
      value={{
        test: props.test,
        apiUrl: props.apiUrl,
      }}
    >
      {props.children}
    </SDKContext.Provider>
  )
}

export default BloomSdk
