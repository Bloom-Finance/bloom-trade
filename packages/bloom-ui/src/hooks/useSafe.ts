import { ethers } from 'ethers'
import Safe from '@safe-global/safe-core-sdk'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import { useAccount, useProvider, erc20ABI, useSigner } from 'wagmi'
import { Chain, Asset } from '@bloom-trade/types'
import { getChainIdByName, getGnosisService } from '@bloom-trade/utilities'
import { providers } from 'ethers'
import SafeServiceClient, {
  AllTransactionsOptions,
  SafeInfoResponse,
  SignatureResponse,
} from '@safe-global/safe-service-client'
import { MetaTransactionData, SafeMultisigTransactionResponse, SafeTransaction } from '@safe-global/safe-core-sdk-types'
export default function useSafe() {
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { address } = useAccount()
  /**
   * Gets list of safe addresses owned by current user
   * @returns {string[]}
   */
  const getSafes = async (
    chain: Chain | 'goerli',
    safeAddress: string,
    alternalProvider?: {
      infura: {
        projectId: string
      }
    },
  ) => {
    if (!safeAddress) throw new Error('No address found')
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: provider
        ? provider
        : new providers.InfuraProvider(getChainIdByName(chain), alternalProvider?.infura.projectId),
    })
    const txServiceUrl = getGnosisService(chain)
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const safes = await safeService.getSafesByOwner(safeAddress)
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
      value: '0',
      data: data,
    }
    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })
    const txHash = await safeSdk.getTransactionHash(safeTransaction)
    const signedSafeTransaction = await safeSdk.signTransactionHash(txHash)
    await safeService.proposeTransaction({
      safeAddress: safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash: txHash,
      senderAddress: await signer.getAddress(),
      senderSignature: signedSafeTransaction.data,
    })
    return {
      txHash,
      signedSafeTransaction,
      safeTransaction,
    }
  }

  // This function retrieves the information for a Safe
  // address: the address of the Safe
  // provider: the web3 provider
  const getSafeInfo = async (
    chain: Chain | 'goerli',
    safeAddress: string,
    alternalProvider?: {
      infura: {
        projectId: string
      }
    },
  ) => {
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: provider
        ? provider
        : new providers.InfuraProvider(getChainIdByName(chain), alternalProvider?.infura.projectId),
    })
    const txServiceUrl = getGnosisService(chain)
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const safeInfo: SafeInfoResponse = await safeService.getSafeInfo(safeAddress)
    return safeInfo
  }

  /**
   * It takes a transaction hash and a chain, and returns the transaction details
   * @param {string} txHash - The transaction hash of the transaction you want to get info about
   * @param {Chain | 'goerli'} chain - The chain you want to get the transaction info from.
   * @returns The transaction info
   */
  const getTransactionInfo = async (
    txHash: string,
    chain: Chain | 'goerli',
    alternalProvider?: {
      infura: {
        projectId: string
      }
    },
  ) => {
    try {
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: provider
          ? provider
          : new providers.InfuraProvider(getChainIdByName(chain), alternalProvider?.infura.projectId),
      })
      const txServiceUrl = getGnosisService(chain)
      const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
      const tx: SafeMultisigTransactionResponse = await safeService.getTransaction(txHash)
      return tx
    } catch (error) {
      console.log(error)
      throw new Error('Error getting transaction info')
    }
  }

  const getAllTransactions = async (
    chain: Chain | 'goerli',
    safeAddress: string,
    options: AllTransactionsOptions,
    alternalProvider?: {
      infura: {
        projectId: string
      }
    },
  ) => {
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: provider
        ? provider
        : new providers.InfuraProvider(getChainIdByName(chain), alternalProvider?.infura.projectId),
    })
    const txServiceUrl = getGnosisService(chain)
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const { results } = await safeService.getAllTransactions(safeAddress, options)
    return results
  }

  const executeTransaction = async (
    safeAddress: string,
    safeTransaction: SafeTransaction | SafeMultisigTransactionResponse,
  ) => {
    //staff
    if (!signer) throw new Error('No signer found')
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer })
    const safeSdk: Safe = await Safe.create({ ethAdapter, safeAddress: safeAddress })
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
    await executeTxResponse.transactionResponse?.wait()
    return safeTransaction
  }

  const signTransaction = async (chain: Chain | 'goerli', safeAddress: string, txHash: string) => {
    if (!signer) throw new Error('No signer found')
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer })
    const txServiceUrl = getGnosisService(chain)
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const safeSdk: Safe = await Safe.create({ ethAdapter, safeAddress: safeAddress })
    const { data: eth_signature } = await safeSdk.signTransactionHash(txHash)
    const signature: SignatureResponse = await safeService.confirmTransaction(txHash, eth_signature)
    return signature.signature
  }

  const getPendingTransactions = async (
    chain: Chain | 'goerli',
    safeAddress: string,
    alternalProvider?: {
      infura: {
        projectId: string
      }
    },
  ) => {
    try {
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: provider
          ? provider
          : new providers.InfuraProvider(getChainIdByName(chain), alternalProvider?.infura.projectId),
      })
      const txServiceUrl = getGnosisService(chain)
      const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
      const { results } = await safeService.getPendingTransactions(safeAddress)
      return results
    } catch (error) {
      throw new Error('Error getting pending transactions')
    }
  }

  return {
    getSafes,
    sendToken,
    getSafeInfo,
    getAllTransactions,
    getPendingTransactions,
    executeTransaction,
    getTransactionInfo,
    signTransaction,
  }
}
