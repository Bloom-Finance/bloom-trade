import { ethers } from 'ethers'
import Safe, { SafeFactory } from '@safe-global/safe-core-sdk'
import EthersAdapter, { EthersAdapterConfig } from '@safe-global/safe-ethers-lib'
import { useAccount, useProvider } from 'wagmi'
import { Chain } from '@bloom-trade/types'
import { getGnosisService } from '@bloom-trade/utilities'
import SafeServiceClient, { SafeInfoResponse } from '@safe-global/safe-service-client'
import { MetaTransactionData, SafeTransactionData } from '@safe-global/safe-core-sdk-types'
export default function useSafe() {
  const provider = useProvider()
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

  const createTransaction = async (
    params: { to: string; value: string; data: string },
    safeAddress: string,
    chain: Chain | 'goerli',
  ) => {
    if (!provider) throw new Error('No provider found')
    if (!address) throw new Error('No address found')
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: provider })
    const safeSdk: Safe = await Safe.create({ ethAdapter, safeAddress: safeAddress })
    const safeTransactionData: MetaTransactionData = {
      to: params.to,
      value: params.value,
      data: params.data,
    }
    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })
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

  const executeTransaction = async () => {
    //staff
  }
  return { getSafes, createTransaction, getSafeInfo }
}
