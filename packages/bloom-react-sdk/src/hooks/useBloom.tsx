import { Button } from '@mui/material'
import { useWeb3Modal, useWeb3ModalNetwork } from '@web3modal/react'
import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork, usePrepareContractWrite, useSwitchNetwork, useWaitForTransaction } from 'wagmi'
import { Connector, disconnect } from '@wagmi/core'
import { Stack } from '@mui/system'
import { Chain, StableCoin, Testnet } from '@bloom-trade/types'
import { useContractWrite } from 'wagmi'
import {
  convertDecimalsUnitToToken,
  getBloomContractsByChain,
  getChainIdByName,
  getChainNameById,
  getSwapperAbi,
  getTestnetFromMainnet,
  getTokenContractMetadataBySymbolAndChain,
  getTransfersAbi,
} from '@bloom-trade/utilities'
import { BigNumber } from 'ethers'
import { BloomStore } from '../store/BloomReact'
export default function useBloom(params?: {
  onWalletConnect?: (
    address: `0x${string}` | undefined,
    connector: Connector<any, any, any> | undefined,
    isReconnected: boolean,
  ) => void
}) {
  const [waitingForUserResponse, setWaitingForUserResponse] = useState(false)
  const [lastTxData, setLastTxData] = useState<{
    txHash: string
  }>()
  const [error, setError] = useState<{
    type: 'UserRejectedRequestError' | 'common'
    message: string
  }>()
  const store = BloomStore.useState((s) => s)
  const { switchNetwork } = useSwitchNetwork()
  const { selectedChain } = useWeb3ModalNetwork()
  const [waitingForBlockchain, setWaitingForBlockchain] = useState(false)
  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>('0x')
  const [bloomContractAddress, setBloomContractAddress] = useState<`0x${string}`>('0x')
  const [transferContract, setTransferContract] = useState<{
    address: `0x${string}`
    abi: Array<any>
    functionName: string
    args: { to: string; amount: string }
  }>({
    address: '0x',
    abi: [],
    functionName: '',
    args: {
      to: '0x',
      amount: '0',
    },
  })

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
  const { config: BloomContractConfig } = usePrepareContractWrite({
    address: transferContract.address as `0x${string}`,
    abi: transferContract.abi,
    functionName: transferContract.functionName as any,
    args: [transferContract.args.to, transferContract.args.amount],
  })
  const {
    writeAsync: TransferTokens,
    data: transferTokenData,
    isError: isTransferError,
    error: transferError,
    isLoading: loadingTransfer,
  } = useContractWrite(BloomContractConfig)
  const {
    writeAsync: requestToken,
    isLoading: loadingApprove,
    data: requestTokenData,
    isError,
    error: approveError,
  } = useContractWrite(config)
  const { open, isOpen } = useWeb3Modal()
  const { isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      params?.onWalletConnect?.(address, connector, isReconnected)
    },
  })
  const { isLoading: loadingApproveTxHash } = useWaitForTransaction({
    hash: requestTokenData?.hash,
  })
  const { isLoading: loadingTransferTxHash } = useWaitForTransaction({
    hash: transferTokenData?.hash,
  })
  useEffect(() => {
    setLastTxData({
      txHash: requestTokenData?.hash as string,
    })
    setWaitingForUserResponse(loadingApprove)
    setWaitingForBlockchain(loadingApproveTxHash)
    if (isError && approveError) {
      setError({
        type: approveError.name as any,
        message: approveError.message,
      })
    } else {
      setError(undefined)
    }
  }, [loadingApprove, loadingApproveTxHash, approveError, isError])
  useEffect(() => {
    setLastTxData({
      txHash: transferTokenData?.hash as string,
    })
    setWaitingForUserResponse(loadingTransfer)
    setWaitingForBlockchain(loadingTransferTxHash)

    if (transferError && isTransferError) {
      setError({
        type: transferError.name as any,
        message: transferError.message,
      })
    } else {
      setError(undefined)
    }
  }, [transferTokenData, isTransferError, transferError, loadingTransferTxHash, loadingTransfer])

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
  //Transfer tokens to the Bloom contract and then to target user
  const Transfer = async (
    from: { token: StableCoin },
    to: { chain: Chain; token: StableCoin; address: string },
    amount: string,
  ) => {
    const { isChainCorrect, change } = checkChain(to.chain)
    if (!isChainCorrect) {
      change()
    }
    const type = from.token === to.token ? 'transfers' : 'swapper'
    const bloomContract = getBloomContractsByChain(
      store.testnet ? (getTestnetFromMainnet(to.chain) as Testnet) : to.chain,
      type,
    )
    const abi = type === 'transfers' ? getTransfersAbi() : getSwapperAbi()
    const args = {
      to: to.address,
      amount: convertDecimalsUnitToToken(
        amount,
        getTokenContractMetadataBySymbolAndChain(from.token, to.chain)?.decimals as number,
      ),
    }

    setTransferContract({
      address: bloomContract as `0x${string}`,
      abi,
      functionName:
        type === 'transfers'
          ? `send${from.token.toUpperCase()}ToAddress`
          : `send${from.token.toUpperCase()}To${to.token.toUpperCase()}Address`,
      args,
    })
    if (!TransferTokens) return
    TransferTokens()
  }

  const checkChain = (
    desiredChain: Chain,
  ): {
    isChainCorrect: boolean
    change: () => void
    chains: {
      from: {
        name: Chain
        id: number
      }
      to: {
        name: Chain | Testnet
        id: number
      }
    }
  } => {
    if (!selectedChain) throw new Error('Chain not supported')
    const sourceChainId = selectedChain.id
    const destinationChainName = store.testnet ? (getTestnetFromMainnet(desiredChain) as Chain | Testnet) : desiredChain
    const destinationChainId = getChainIdByName(destinationChainName)
    if (!sourceChainId || !destinationChainId || !switchNetwork) {
      throw new Error('Chain not supported')
    }
    if (sourceChainId !== destinationChainId) {
      return {
        isChainCorrect: false,
        change: () => {
          switchNetwork(destinationChainId)
        },
        chains: {
          from: {
            name: getChainNameById(selectedChain.id) as Chain,
            id: selectedChain.id,
          },
          to: {
            name: destinationChainName,
            id: destinationChainId,
          },
        },
      }
    } else {
      return {
        isChainCorrect: true,
        change: () => {
          //nothing
        },
        chains: {
          from: {
            name: getChainNameById(selectedChain.id) as Chain,
            id: selectedChain.id,
          },
          to: {
            name: destinationChainName,
            id: destinationChainId,
          },
        },
      }
    }
  }
  return {
    Connect: walletConnectButton,
    RequestTokenAccess,
    waitingForUserResponse,
    waitingForBlockchain,
    checkChain,
    error,
    Transfer,
    data: lastTxData,
  }
}
