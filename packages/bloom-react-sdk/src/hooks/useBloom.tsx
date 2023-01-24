import { Testnet } from '@bloom-trade/types'
import { Web3Button } from '@web3modal/react'
import React from 'react'
// import { getWagmiInstanceByChainName } from '@bloom-trade/utilities'
export default function useBloom(params?: {
  useTestnet?: {
    testnet: boolean
    chain: Testnet
  }
}) {
  console.log(params)
  const walletConnectButton = (params: { icon?: 'show' | 'hide'; label?: string }) => {
    return <Web3Button icon={params.icon} label={params.label} />
  }
  return {
    Connect: walletConnectButton,
  }
}
