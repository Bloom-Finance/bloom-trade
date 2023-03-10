import { Chain, Testnet } from '@bloom-trade/types'
import {
  getChainIdByName,
  getChainNameById,
  getMainnetFromTestnet,
  getTestnetFromMainnet,
  getWagmiInstanceByChainName,
} from '@bloom-trade/utilities'
import { useContext, useEffect, useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { disconnect } from '@wagmi/core'
import { SDKContext } from '../wrapper/context'
import BloomServices from '@bloom-trade/services'
import { useWeb3Modal } from '@web3modal/react'
import React from 'react'
export default function useWallet() {
  /*WAGMI  and WalletConnect Hooks*/
  const { switchNetwork } = useSwitchNetwork()
  const { setDefaultChain } = useWeb3Modal()
  const { open, isOpen } = useWeb3Modal()

  const { isConnected, address } = useAccount()
  const { apiKey } = useContext(SDKContext)
  const { chain: selectedChain } = useNetwork()
  const { testnet } = useContext(SDKContext)
  const [hasMounted, setHasMounted] = useState(false)
  /*Hooks and functions regarding useWallet*/
  const [balance, setBalance] = useState<{ currency: Bloom.StableCoin; amount: string }[]>([])
  const bloomServices = new BloomServices(apiKey, '', {
    test: testnet || false,
  })

  /* A function that returns a button that connects to a wallet. */
  const walletConnectButton = (params: {
    icon?: 'show' | 'hide'
    label?: string
    disabled?: boolean
    chain?: Chain | Testnet
  }) => {
    if (!hasMounted) return null
    if (params.chain) {
      setDefaultChain(getWagmiInstanceByChainName(params.chain))
    }
    return (
      <button
        disabled={params.disabled}
        onClick={() => {
          if (isConnected) {
            disconnect()
          } else {
            open()
          }
        }}
      >
        {isOpen ? (
          <div>
            <p>Connecting...</p>
          </div>
        ) : isConnected ? (
          'Disconnect'
        ) : (
          params.label || 'Connect Wallet'
        )}
      </button>
    )
  }

  useEffect(() => {
    setHasMounted(true)
    if (!isConnected || !address || !selectedChain?.id) return
    ;(async () => {
      const balance = await bloomServices.getBalance(
        {
          dex: {
            addresses: [address as string],
            chains: [
              testnet
                ? getMainnetFromTestnet(getChainNameById(selectedChain.id) as Testnet)
                : (getChainNameById(selectedChain.id) as Chain),
            ],
          },
        },
        {
          onlyStableCoins: true,
        },
      )
      const newBalances: React.SetStateAction<any[]> = []
      balance.forEach((b) => {
        if (parseFloat(b.balance).toFixed(2).toString() !== '0.00') {
          newBalances.push({
            amount: parseFloat(b.balance).toFixed(2),
            currency: b.asset,
          })
        }
      })
      setBalance(newBalances)
    })()
  }, [])

  /**
   * It checks if the current chain is the same as the desired chain, and if not, it returns an object
   * with a function to change the chain
   */
  const checkChain = (
    desiredChain: Chain,
  ): {
    isChainCorrect: boolean
    change: () => void
  } => {
    if (!selectedChain) throw new Error('Chain not supported')
    const sourceChainId = selectedChain.id
    const destinationChainName = testnet ? (getTestnetFromMainnet(desiredChain) as Chain | Testnet) : desiredChain
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
      }
    } else {
      return {
        isChainCorrect: true,
        change: () => {
          //nothing
        },
      }
    }
  }

  return {
    checkChain,
    Connect: walletConnectButton,
    balance,
    chain: {
      name: selectedChain?.id ? getChainNameById(selectedChain?.id) : undefined,
      id: selectedChain?.id,
    },
  }
}
