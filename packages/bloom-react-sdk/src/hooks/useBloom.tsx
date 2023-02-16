/* eslint-disable @typescript-eslint/no-extra-semi */
import { Button } from '@mui/material'
import { useWeb3Modal } from '@web3modal/react'
import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
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

  const { data: signer } = useSigner()

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
  //In order to correctly request token access, you must first be signed in to a wallet
  /**
   * Request token access by passing in the token, chain, amount, and type of request
   * @param {StableCoin} token - StableCoin - The token you want to request access to.
   * @param {Chain | Testnet} chain - Chain | Testnet
   * @param {string} amount - The amount of the token you want to request access to.
   * @param {'transfers' | 'swapper'} type - 'transfers' | 'swapper'
   * @returns The txReceipt
   */
  const requestTokenAccess = async (
    token: StableCoin,
    chain: Chain | Testnet,
    amount: string,
    type: 'transfers' | 'swapper',
  ) => {
    try {
      const retrievedToken = getTokenContractMetadataBySymbolAndChain(token, chain)
      if (!isConnected) throw new Error('You must be signed in to a wallet to request token access')
      if (!retrievedToken) throw new Error('No token found')
      if (!signer) throw new Error('No detected signer')

      const requestContract = new ethers.Contract(retrievedToken.address as `0x${string}`, erc20ABI, signer)
      setWaitingForUserResponse(true)
      const populatedApprove = await requestContract.populateTransaction.approve(
        getBloomContractsByChain(chain, type) as `0x${string}`,
        convertDecimalsUnitToToken(amount, retrievedToken.decimals),
      )
      const tx = await signer.sendTransaction(populatedApprove)
      setLastTxData({
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
  /**
   * It takes in a from object, a to object, and an amount, and then it checks if the chain is correct,
   * and if it is, it sets the transfer contract, and then it transfers the tokens
   * @param from - { token: StableCoin }
   * @param to - { chain: Chain; token: StableCoin; address: string }
   * @param {string} amount - The amount of tokens to transfer.
   * @returns A transaction receipt
   */
  const transfer = async (
    from: { token: StableCoin },
    to: { chain: Chain; token: StableCoin; address: string },
    amount: string,
  ) => {
    try {
      const { isChainCorrect, change } = checkChain(to.chain)
      if (!isChainCorrect) {
        change()
        return
      }
      if (!signer) throw new Error('No detected signer')
      console.log(getTokenContractMetadataBySymbolAndChain(from.token, to.chain)?.address as string)
      const allowanceContract = new ethers.Contract(
        getTokenContractMetadataBySymbolAndChain(
          from.token,
          store.testnet ? (getTestnetFromMainnet(to.chain) as Testnet) : to.chain,
        )?.address as string,
        erc20ABI,
        signer,
      )
      const type = from.token === to.token ? 'transfers' : 'swapper'
      const bloomContractAddress = getBloomContractsByChain(
        store.testnet ? (getTestnetFromMainnet(to.chain) as Testnet) : to.chain,
        type,
      )
      const allowanceOfToken = (await allowanceContract.allowance(address, bloomContractAddress)) as BigNumber

      console.log(parseInt(amount))
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
      const bloomContract = new ethers.Contract(bloomContractAddress as `0x${string}`, abi, signer)

      setWaitingForUserResponse(true)
      const tx = await bloomContract[functionName](args.to, args.amount)
      setLastTxData({
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
    waitingForUserResponse,
    waitingForBlockchain,
    error,
    data: lastTxData,
  }
}
