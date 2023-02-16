import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { BLOOM_URL_API, BLOOM_URL_API_TEST } from '../@types/GLOBAL'
import { IBloomReactProps } from '../components/BloomReact'
import { BloomStore } from '../store/BloomReact'

const withPreCheckStore = (Component: React.ComponentType<IBloomReactProps>) => {
  const PreFetch = (props: IBloomReactProps) => {
    const { isConnected } = useAccount()
    useEffect(() => {
      const deepLink = window.localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')
      if (isConnected && deepLink) {
        try {
          const _deepLink: { name: string; href: string } = JSON.parse(deepLink)
          if (_deepLink.href === 'https://link.trustwallet.com') {
            window.localStorage.setItem(
              'WALLETCONNECT_DEEPLINK_CHOICE',
              JSON.stringify({ name: 'Trust Wallet', href: 'https://link.trustwallet.com/wc' }),
            )
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.log('TrustWallet force redirect err', err)
        }
      }
    }, [isConnected])
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
