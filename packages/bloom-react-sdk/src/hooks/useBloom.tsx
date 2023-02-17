/* eslint-disable @typescript-eslint/no-extra-semi */
import { Button } from '@mui/material'
import { useWeb3Modal } from '@web3modal/react'
import React, { useEffect, useState } from 'react'
import {
  useAccount,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useContractWrite,
  useProvider,
  useWaitForTransaction,
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
  /*WAGMI  and WalletConnect Hooks*/
  const { switchNetwork } = useSwitchNetwork()

  const { chain: selectedChain } = useNetwork()

  const provider = useProvider()

  const { isConnected, address } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      params?.onWalletConnect?.(address, connector, isReconnected)
    },
  })

  const { open, isOpen } = useWeb3Modal()

  /*Hooks and functions regarding useBloom*/
  const [hasMounted, setHasMounted] = useState(false)

  const store = BloomStore.useState((s) => s)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const [erc20Token, setErc20Token] = useState<
    | {
        address: `0x${string}`
        args: {
          spender: `0x${string}`
          amount: BigNumber
        }
      }
    | undefined
  >()

  const [transferData, setTransferData] = useState<
    | {
        address: `0x${string}`
        abi: any[]
        functionName: string
        args: [`0x${string}`, string]
      }
    | undefined
  >()

  /*Hooks and functions regarding ERC20 Token interactions*/

  const { config: tokenApprovalConfig } = usePrepareContractWrite({
    address: erc20Token?.address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [erc20Token?.args.spender as `0x${string}`, erc20Token?.args.amount as BigNumber],
    enabled: erc20Token !== undefined,
  })

  const {
    write: approve,
    data: tokenApprovalTxResult,
    error: errorTokenApproval,
    isLoading: waitingForUserResponseTokenApproval,
  } = useContractWrite(tokenApprovalConfig)

  const { data: tokenApproveTxReceipt, isLoading: waitingForBlockChainTokenApprove } = useWaitForTransaction({
    hash: tokenApprovalTxResult?.hash,
  })

  /*Hooks and function for transfering or swapping tokens*/

  const { config: transferConfig } = usePrepareContractWrite({
    address: transferData?.address,
    abi: transferData?.abi,
    functionName: transferData?.functionName,
    args: transferData?.args,
    enabled: transferData !== undefined,
  })
  const {
    write: transfer,
    data: transferTxResult,
    isLoading: waitingForUserResponseTransfer,
    error: errorTransfer,
  } = useContractWrite(transferConfig)
  console.log(transferTxResult?.hash)
  const { data: transferTxReceipt, isLoading: waitingForBlockChainTransfer } = useWaitForTransaction({
    hash: transferTxResult?.hash,
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

  /**
   * It checks if the current chain is the same as the desired chain, and if not, it returns an object
   * with a function to change the chain
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
    checkChain,
    token: {
      prepareApprove: (token: StableCoin, chain: Chain | Testnet, amount: string, type: 'transfers' | 'swapper') => {
        const retrievedToken = getTokenContractMetadataBySymbolAndChain(token, chain)
        if (!isConnected) throw new Error('You must be signed in to a wallet to request token access')
        if (!retrievedToken) throw new Error('No token found')
        setErc20Token({
          address: retrievedToken.address as `0x${string}`,
          args: {
            spender: getBloomContractsByChain(chain, type) as `0x${string}`,
            amount: ethers.BigNumber.from(convertDecimalsUnitToToken(amount, retrievedToken.decimals)),
          },
        })
      },
      approve: () => {
        if (!isConnected) throw new Error('You must be signed in to a wallet to request token access')
        if (!approve) return
        approve()
      },
      waitingForUserResponse: waitingForUserResponseTokenApproval,
      waitingForBlockchain: waitingForBlockChainTokenApprove,
      txHash: tokenApprovalTxResult?.hash,
      receipt: tokenApproveTxReceipt,
      error: errorTokenApproval,
    },
    transfer: {
      prepareTransfer: async (
        from: { token: StableCoin },
        to: { chain: Chain; token: StableCoin; address: string },
        amount: string,
      ) => {
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

        //Here we know for sure that we have enough allowance

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
      },
      transfer: () => {
        if (!isConnected) throw new Error('You must be signed in to a wallet to request token access')
        if (!transfer) return
        transfer()
      },
      waitingForUserResponse: waitingForUserResponseTransfer,
      waitingForBlockchain: waitingForBlockChainTransfer,
      txHash: transferTxResult?.hash,
      receipt: transferTxReceipt,
      error: errorTransfer,
    },
  }
}
