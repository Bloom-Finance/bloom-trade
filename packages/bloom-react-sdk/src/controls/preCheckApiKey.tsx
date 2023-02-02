import React, { useEffect } from 'react'
import { BLOOM_URL_API, BLOOM_URL_API_TEST } from '../@types/GLOBAL'
import { IBloomReactProps } from '../components/BloomReact'
import { BloomStore } from '../store/BloomReact'

const withPreCheckStore = (Component: React.ComponentType<IBloomReactProps>) => {
  const PreFetch = (props: IBloomReactProps) => {
    useEffect(() => {
      if (!props.credentials) {
        throw new Error('Credentials are required')
      }
      BloomStore.update((s) => {
        s.url = props.useTestnet ? BLOOM_URL_API_TEST : BLOOM_URL_API
        s.credentials = props.credentials
        s.testnet = props.useTestnet || false
      })
    }, [])
    return <Component {...props} />
  }
  return PreFetch
}

export default withPreCheckStore
