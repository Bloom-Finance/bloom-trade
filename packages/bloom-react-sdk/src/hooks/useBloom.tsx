/* eslint-disable @typescript-eslint/no-extra-semi */
import { Button } from '@mui/material'
import { useWeb3Modal } from '@web3modal/react'
import React, { useEffect, useState } from 'react'
import {
  useAccount,
  useNetwork,
  usePrepareContractWrite,
  useSigner,
  useSwitchNetwork,
  useContractWrite,
  useContractRead,
  useProvider,
} from 'wagmi'
import { Connector, disconnect } from '@wagmi/core'
import { Stack } from '@mui/system'
import { Chain, StableCoin, Testnet } from '@bloom-trade/types'
import { BloomStore } from '../store/BloomReact'
import { erc20ABI } from '@wagmi/core'
import { ethers, BigNumber } from 'ethers'
import {
  convertDecimalsUnitToToken,
  convertTokenToDecimalsUnit,
  getBloomContractsByChain,
  getChainIdByName,
  getChainNameById,
  getSwapperAbi,
  getTestnetFromMainnet,
  getTokenContractMetadataBySymbolAndChain,
  getTransfersAbi,
} from '@bloom-trade/utilities'

export default function useBloom(params?: {
  onWalletConnect?: (
    address: `0x${string}` | undefined,
    connector: Connector<any, any, any> | undefined,
    isReconnected: boolean,
  ) => void
}) {
  const [waitingForUserResponse, setWaitingForUserResponse] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const provider = useProvider()
  const [lastTxData, setLastTxData] = useState<{
    txHash: string
    transactionReceipt?: ethers.providers.TransactionReceipt
  }>()

  const [error, setError] = useState<{
    type: 'UserRejectedError' | 'common'
    message: string
  }>()
  const store = BloomStore.useState((s) => s)

  const { switchNetwork } = useSwitchNetwork()

  const [waitingForBlockchain, setWaitingForBlockchain] = useState(false)

  const { chain: selectedChain } = useNetwork()

  const { open, isOpen } = useWeb3Modal()

  const { isConnected, address } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      params?.onWalletConnect?.(address, connector, isReconnected)
    },
  })
  /*Hooks and functions regarding ERC20 Token interactions*/
  const [erc20Token, setTokenApproval] = useState<
    | {
        address: `0x${string}`
        args: {
          spender: `0x${string}`
          amount: BigNumber
        }
      }
    | undefined
  >()

  const { config: tokenApprovalConfig } = usePrepareContractWrite({
    address: erc20Token?.address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [erc20Token?.args.spender as `0x${string}`, erc20Token?.args.amount as BigNumber],
    enabled: erc20Token !== undefined,
  })

  const { writeAsync: requestTokenApproval } = useContractWrite(tokenApprovalConfig)

  const prepareRequesTokenAccess = (
    token: StableCoin,
    chain: Chain | Testnet,
    amount: string,
    type: 'transfers' | 'swapper',
  ) => {
    const retrievedToken = getTokenContractMetadataBySymbolAndChain(token, chain)
    if (!isConnected) throw new Error('You must be signed in to a wallet to request token access')
    if (!retrievedToken) throw new Error('No token found')
    setTokenApproval({
      address: retrievedToken.address as `0x${string}`,
      args: {
        spender: getBloomContractsByChain(chain, type) as `0x${string}`,
        amount: ethers.BigNumber.from(convertDecimalsUnitToToken(amount, retrievedToken.decimals)),
      },
    })
  }

  const requestTokenAccess = async () => {
    try {
      if (!isConnected) throw new Error('You must be signed in to a wallet to request token access')
      if (!requestTokenApproval) return
      setWaitingForUserResponse(true)
      const tx = await requestTokenApproval()
      setLastTxData({
        ...lastTxData,
        txHash: tx.hash,
      })
      setWaitingForUserResponse(false)
      setWaitingForBlockchain(true)
      const transactionReceipt = (await tx.wait(2)) as ethers.providers.TransactionReceipt
      setWaitingForBlockchain(false)
      setLastTxData({
        txHash: tx.hash,
        transactionReceipt,
      })
      return transactionReceipt
    } catch (error: any) {
      setWaitingForUserResponse(false)
      setError({
        type: error.code === 'ACTION_REJECTED' ? 'UserRejectedError' : 'common',
        message: error.message,
      })
      throw new Error('Error requesting token access')
    }
  }

  /*Hooks and function for transfering or swapping tokens*/
  const [transferData, setTransferData] = useState<
    | {
        address: `0x${string}`
        abi: any[]
        functionName: string
        args: [`0x${string}`, string]
      }
    | undefined
  >()
  const { config: transferConfig } = usePrepareContractWrite({
    address: transferData?.address,
    abi: transferData?.abi,
    functionName: transferData?.functionName,
    args: transferData?.args,
    enabled: transferData !== undefined,
  })
  const { writeAsync } = useContractWrite(transferConfig)
  const prepareTransfer = async (
    from: { token: StableCoin },
    to: { chain: Chain; token: StableCoin; address: string },
    amount: string,
  ) => {
    try {
      const allowanceContract = new ethers.Contract(
        getTokenContractMetadataBySymbolAndChain(
          from.token,
          store.testnet ? (getTestnetFromMainnet(to.chain) as Testnet) : to.chain,
        )?.address as string,
        erc20ABI,
        provider,
      )
      const type = from.token === to.token ? 'transfers' : 'swapper'
      const bloomContractAddress = getBloomContractsByChain(
        store.testnet ? (getTestnetFromMainnet(to.chain) as Testnet) : to.chain,
        type,
      ) as `0x${string}`
      const allowanceOfToken = (await allowanceContract.allowance(address, bloomContractAddress)) as BigNumber
      if (
        parseInt(
          convertTokenToDecimalsUnit(
            allowanceOfToken.toString(),
            getTokenContractMetadataBySymbolAndChain(
              from.token,
              store.testnet ? (getTestnetFromMainnet(to.chain) as Testnet) : to.chain,
            )?.decimals as number,
          ),
        ) < parseInt(amount)
      ) {
        throw new Error('We do not have enough allowance to transfer this amount of tokens')
      }

      // Here we know that we have enough allowance

      const abi = type === 'transfers' ? getTransfersAbi() : getSwapperAbi()
      const args = {
        to: to.address,
        amount: convertDecimalsUnitToToken(
          amount,
          getTokenContractMetadataBySymbolAndChain(from.token, to.chain)?.decimals as number,
        ),
      }

      const functionName =
        type === 'transfers'
          ? `send${from.token.toUpperCase()}ToAddress`
          : `send${from.token.toUpperCase()}To${to.token.toUpperCase()}Address`
      setTransferData({
        address: bloomContractAddress,
        abi,
        functionName,
        args: [args.to as `0x${string}`, args.amount as string],
      })
    } catch (error: any) {
      setWaitingForUserResponse(false)
      setError({
        type: error.code === 'ACTION_REJECTED' ? 'UserRejectedError' : 'common',
        message: error.message,
      })
      throw new Error('Error requesting setting transfer data')
    }
  }

  const transfer = async () => {
    try {
      if (!writeAsync) return
      setWaitingForUserResponse(true)
      const tx = await writeAsync()
      setLastTxData({
        ...lastTxData,
        txHash: tx.hash,
      })
      setWaitingForUserResponse(false)
      setWaitingForBlockchain(true)
      const transactionReceipt = (await tx.wait(2)) as ethers.providers.TransactionReceipt
      setWaitingForBlockchain(false)
      setLastTxData({
        txHash: tx.hash,
        transactionReceipt,
      })
      return transactionReceipt
    } catch (error: any) {
      setWaitingForUserResponse(false)
      setError({
        type: error.code === 'ACTION_REJECTED' ? 'UserRejectedError' : 'common',
        message: error.message,
      })
      throw new Error('Error requesting tx access')
    }
  }

  /* A function that returns a button that connects to a wallet. */
  const walletConnectButton = (params: { icon?: 'show' | 'hide'; label?: string; disabled?: boolean }) => {
    if (!hasMounted) return null
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

  /**
   * It checks if the current chain is the same as the desired chain, and if not, it returns an object
   * with a function to change the chain
   * @param {Chain} desiredChain - Chain - the chain you want to check if you're on
   * @returns An object with three properties:
   *   isChainCorrect: boolean
   *   change: () => void
   *   chains: {
   *     from: {
   *       name: Chain
   *       id: number
   *     }
   *     to: {
   *       name: Chain | Testnet
   *       id: number
   *     }
   *   }
   */
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
    requestTokenAccess,
    checkChain,
    transfer,
    prepareRequesTokenAccess,
    prepareTransfer,
    waitingForUserResponse,
    waitingForBlockchain,
    error,
    data: lastTxData,
  }
}
