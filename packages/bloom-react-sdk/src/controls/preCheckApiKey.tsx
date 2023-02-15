import React, { useEffect } from 'react'
import { BLOOM_URL_API, BLOOM_URL_API_TEST } from '../@types/GLOBAL'
import { IBloomReactProps } from '../components/BloomReact'
import { BloomStore } from '../store/BloomReact'

const withPreCheckStore = (Component: React.ComponentType<IBloomReactProps>) => {
  const PreFetch = (props: IBloomReactProps) => {
    const deepLink = window.localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')
    useEffect(() => {
      if (deepLink) {
        try {
          const _deepLink: { name: string; href: string } = JSON.parse(deepLink)
          if (_deepLink.href === 'https://link.trustwallet.com/wc') {
            window.localStorage.setItem(
              'WALLETCONNECT_DEEPLINK_CHOICE',
              JSON.stringify({ name: 'Trust Wallet', href: 'trust://' }),
            )
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.log('TrustWallet force redirect err', err)
        }
      }
    }, [deepLink])
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
