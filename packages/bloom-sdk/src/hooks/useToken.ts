import { Chain, StableCoin, Testnet } from '@bloom-trade/types'
import {
  convertDecimalsUnitToToken,
  convertTokenToDecimalsUnit,
  getBloomContractsByChain,
  getSwapperAbi,
  getTestnetFromMainnet,
  getTokenContractMetadataBySymbolAndChain,
  getTransfersAbi,
} from '@bloom-trade/utilities'
import { useContext, useState } from 'react'
import {
  erc20ABI,
  useAccount,
  useProvider,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { BigNumber, ethers } from 'ethers'
import { SDKContext } from '../wrapper/context'
export default function useToken() {
  /*WAGMI  and WalletConnect Hooks*/
  const { isConnected, address } = useAccount()
  const provider = useProvider()

  /*Hooks and functions regarding useToken*/
  const { testnet } = useContext(SDKContext)
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
  const { data: transferTxReceipt, isLoading: waitingForBlockChainTransfer } = useWaitForTransaction({
    hash: transferTxResult?.hash,
  })

  return {
    approve: {
      prepare: (token: StableCoin, chain: Chain | Testnet, amount: string, type: 'transfers' | 'swapper') => {
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
      execute: () => {
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
      prepare: async (
        from: { token: StableCoin },
        to: { chain: Chain; token: StableCoin; address: string },
        amount: string,
      ) => {
        const allowanceContract = new ethers.Contract(
          getTokenContractMetadataBySymbolAndChain(
            from.token,
            testnet ? (getTestnetFromMainnet(to.chain) as Testnet) : to.chain,
          )?.address as string,
          erc20ABI,
          provider,
        )

        const type = from.token === to.token ? 'transfers' : 'swapper'
        const bloomContractAddress = getBloomContractsByChain(
          testnet ? (getTestnetFromMainnet(to.chain) as Testnet) : to.chain,
          type,
        ) as `0x${string}`
        const allowanceOfToken = (await allowanceContract.allowance(address, bloomContractAddress)) as BigNumber
        if (
          parseInt(
            convertTokenToDecimalsUnit(
              allowanceOfToken.toString(),
              getTokenContractMetadataBySymbolAndChain(
                from.token,
                testnet ? (getTestnetFromMainnet(to.chain) as Testnet) : to.chain,
              )?.decimals as number,
            ),
          ) < parseInt(amount)
        ) {
          throw new Error('We do not have enough allowance to transfer this amount of tokens')
        }

        //Here we know for sure that we have enough allowance to transfer the amount of tokens
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
      execute: () => {
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
