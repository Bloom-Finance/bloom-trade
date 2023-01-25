import React, { useEffect } from 'react'
import { BLOOM_URL_API, BLOOM_URL_API_TEST } from '../@types/GLOBAL'
import { IBloomReactProps } from '../components/BloomReact'
import { BloomStore } from '../store/BloomReact'

const withPreCheckStore = (Component: React.ComponentType<IBloomReactProps>) => {
  const PreFetch = (props: IBloomReactProps) => {
    useEffect(() => {
      if (!props.apiKey) {
        throw new Error('API Key is required')
      }
      BloomStore.update((s) => {
        s.url = props.useTestnet ? BLOOM_URL_API_TEST : BLOOM_URL_API
        s.apiKey = props.apiKey
        s.testnet = props.useTestnet || false
      })
    }, [])
    return <Component {...props} />
  }
  return PreFetch
}

export default withPreCheckStore
