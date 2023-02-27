import { ethers } from 'ethers'
import Safe from '@safe-global/safe-core-sdk'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import { useAccount, useProvider, erc20ABI, useSigner } from 'wagmi'
import { Chain, Asset } from '@bloom-trade/types'
import { getGnosisService } from '@bloom-trade/utilities'
import SafeServiceClient, { SafeInfoResponse } from '@safe-global/safe-service-client'
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'
export default function useSafe() {
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { address } = useAccount()

  /**
   * Gets list of safe addresses owned by current user
   * @returns {string[]}
   */
  const getSafes = async (chain: Chain | 'goerli') => {
    if (!provider) throw new Error('No provider found')
    if (!address) throw new Error('No address found')
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider })
    const txServiceUrl = getGnosisService(chain)
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const safes = await safeService.getSafesByOwner(address)
    return safes.safes
  }

  const sendToken = async (
    params: { to: `0x${string}`; amount: string; token: `0x${string}` },
    safeAddress: string,
    chain: Chain | 'goerli',
  ) => {
    if (!signer) throw new Error('No provider found')
    if (!provider) throw new Error('No provider found')
    if (!address) throw new Error('No address found')
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer })
    const safeSdk: Safe = await Safe.create({ ethAdapter, safeAddress: safeAddress })
    const contractToken = new ethers.Contract(params.token, erc20ABI, signer)
    const txServiceUrl = getGnosisService(chain)
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const data = contractToken.interface.encodeFunctionData('transfer', [params.to, params.amount])
    const safeTransactionData: MetaTransactionData = {
      to: params.token,
      value: params.amount,
      data: data,
    }
    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })
    const txHash = await safeSdk.getTransactionHash(safeTransaction)
    const signedSafeTransaction = await safeSdk.signTransactionHash(txHash)
    await safeService.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash: txHash,
      senderAddress: await signer.getAddress(),
      senderSignature: signedSafeTransaction.data,
    })
    return {
      txHash,
      signedSafeTransaction,
    }
  }
  // This function retrieves the information for a Safe
  // address: the address of the Safe
  // provider: the web3 provider
  const getSafeInfo = async (address: string, chain: Chain | 'goerli') => {
    if (!provider) throw new Error('No provider found')
    if (!address) throw new Error('No address found')
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider })
    const txServiceUrl = getGnosisService(chain)
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const safeInfo: SafeInfoResponse = await safeService.getSafeInfo(address)
    return safeInfo
  }
  const getAllTransactions = async (address: string, chain: Chain | 'goerli') => {
    if (!provider) throw new Error('No provider found')
    if (!address) throw new Error('No address found')
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider })
    const txServiceUrl = getGnosisService(chain)
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const { results } = await safeService.getAllTransactions(address)
    return results
  }
  const executeTransaction = async () => {
    //staff
  }
  const getPendingTransactions = async (safeAddress: string, chain: Chain | 'goerli') => {
    if (!provider) throw new Error('No provider found')
    if (!address) throw new Error('No address found')
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider })
    const txServiceUrl = getGnosisService(chain)
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const { results } = await safeService.getPendingTransactions(safeAddress)
    return results
  }
  return { getSafes, sendToken, getSafeInfo, getAllTransactions, getPendingTransactions }
}
