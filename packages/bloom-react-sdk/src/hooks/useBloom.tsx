import { Button } from '@mui/material'
import { useWeb3Modal } from '@web3modal/react'
import React from 'react'
import { useAccount } from 'wagmi'
import { Connector, disconnect } from '@wagmi/core'

// import { getWagmiInstanceByChainName } from '@bloom-trade/utilities'
export default function useBloom(params?: {
  onWalletConnect?: (
    address: `0x${string}` | undefined,
    connector: Connector<any, any, any> | undefined,
    isReconnected: boolean,
  ) => void
}) {
  const { open, isOpen } = useWeb3Modal()
  const { isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      params?.onWalletConnect?.(address, connector, isReconnected)
    },
  })
  const walletConnectButton = (params: { icon?: 'show' | 'hide'; label?: string }) => {
    return (
      <Button
        onClick={() => {
          if (isConnected) {
            disconnect()
          } else {
            open()
          }
        }}
        variant='contained'
        startIcon={<img height={'24'} src='https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo.png' />}
      >
        {isOpen ? 'Connecting...' : isConnected ? 'Disconnect' : params.label || 'Connect Wallet'}
      </Button>
    )
  }
  return {
    Connect: walletConnectButton,
  }
}
