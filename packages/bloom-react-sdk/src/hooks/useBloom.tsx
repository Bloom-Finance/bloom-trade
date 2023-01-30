import { Button } from '@mui/material'
import { useWeb3Modal } from '@web3modal/react'
import React, { useEffect, useState } from 'react'
import { useAccount, usePrepareContractWrite } from 'wagmi'
import { Connector, disconnect } from '@wagmi/core'
import { Stack } from '@mui/system'
import { Chain, StableCoin, Testnet } from '@bloom-trade/types'
import { useContractWrite } from 'wagmi'
import {
  convertDecimalsUnitToToken,
  getBloomContractsByChain,
  getTokenContractMetadataBySymbolAndChain,
} from '@bloom-trade/utilities'
import { BigNumber } from 'ethers'
export default function useBloom(params?: {
  onWalletConnect?: (
    address: `0x${string}` | undefined,
    connector: Connector<any, any, any> | undefined,
    isReconnected: boolean,
  ) => void
}) {
  const [waitingForUserResponse, setWaitingForUserResponse] = useState(false)
  const [waitingForBlockchain, setWaitingForBlockchain] = useState(false)
  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>('0x')
  const [bloomContractAddress, setBloomContractAddress] = useState<`0x${string}`>('0x')
  const [fee, setFee] = useState<{
    amount: string
    decimals: number
  }>({ amount: '0', decimals: 18 })
  const { config } = usePrepareContractWrite({
    address: tokenAddress,
    abi: [
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'usr', type: 'address' },
          { internalType: 'uint256', name: 'wad', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'approve' as any,
    args: [bloomContractAddress, convertDecimalsUnitToToken(fee.amount, fee.decimals) as unknown as BigNumber],
  })
  const { write: requestToken, isLoading: loadingApprove } = useContractWrite(config)
  const { open, isOpen } = useWeb3Modal()
  const { isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      params?.onWalletConnect?.(address, connector, isReconnected)
    },
  })
  useEffect(() => {
    setWaitingForUserResponse(loadingApprove)
  }, [loadingApprove])
  const walletConnectButton = (params: { icon?: 'show' | 'hide'; label?: string; disabled?: boolean }) => {
    return (
      <Button
        disabled={params.disabled}
        onClick={() => {
          if (isConnected) {
            disconnect()
          } else {
            open()
          }
        }}
        variant='contained'
        startIcon={
          !isOpen && <img height={'24'} src='https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo.png' />
        }
      >
        {isOpen ? (
          <Stack width={50} height={50}>
            <p>Connecting...</p>
          </Stack>
        ) : isConnected ? (
          'Disconnect'
        ) : (
          params.label || 'Connect Wallet'
        )}
      </Button>
    )
  }
  //In order to correctly request token access, you must first be signed in to a wallet
  const RequestTokenAccess = async (
    token: StableCoin,
    chain: Chain | Testnet,
    amount: string,
    type: 'transfers' | 'swapper',
  ) => {
    if (!isConnected) throw new Error('You must be signed in to a wallet to request token access')
    const retrievedToken = getTokenContractMetadataBySymbolAndChain(token, chain)
    if (!retrievedToken) throw new Error('No token found')
    setBloomContractAddress(getBloomContractsByChain(chain, type) as `0x${string}`)
    setFee({ amount, decimals: retrievedToken.decimals })
    setTokenAddress(retrievedToken.address as `0x${string}`)
    if (!requestToken) return
    await requestToken()
  }
  return {
    Connect: walletConnectButton,
    RequestTokenAccess,
    waitingForUserResponse,
    waitingForBlockchain,
  }
}
