/* eslint-disable react/jsx-key */
import { Order } from '@bloom-trade/types'
import React, { useEffect, useState } from 'react'
import PreviewComponent from './views/preview'
import { BloomStore } from '../../store/BloomReact'
import { useAccount, useSwitchNetwork } from 'wagmi'
import BloomServices from '@bloom-trade/services'
import CurrencySelector from './views/currencySelector'
import { useWeb3ModalNetwork } from '@web3modal/react'
import { getChainIdByName, getChainNameById, getWagmiInstanceByChainName } from '@bloom-trade/utilities'
import { customAlphabet } from 'nanoid'
import { OrderStore } from '../../store/Order'
export interface CheckoutProps {
  order?: Omit<Order, 'from'>
  walletConnectButton: JSX.Element
}

const BloomCheckout = (props: CheckoutProps): JSX.Element => {
  const store = BloomStore.useState((s) => s)
  const { isConnected, address } = useAccount()
  const [steps, setSteps] = useState(0)
  const { switchNetwork } = useSwitchNetwork()
  const [loading, setLoading] = useState(false)
  const [balances, setBalances] = useState<any[]>([])
  const bloomServices = new BloomServices(store.apiKey, {
    test: store.testnet || false,
  })
  const order = OrderStore.useState((s) => s.order)
  const { selectedChain } = useWeb3ModalNetwork()
  useEffect(() => {
    if (props.order) {
      OrderStore.update((s) => {
        s.order = {
          id: props.order && props.order.id ? props.order.id : '',
          orderId: props.order && props.order.orderId ? props.order.orderId : '',
          date: props.order && props.order.date ? props.order.date : Date.now(),
          total: {
            amount: props.order && props.order.total.amount ? props.order.total.amount : 0,
          },
          destination: {
            chain: props.order && props.order.destination.chain ? props.order.destination.chain : 'eth',
            address: props.order && props.order.destination.address ? props.order.destination.address : '',
            token: props.order && props.order.destination.token ? props.order.destination.token : 'dai',
            description: {
              name:
                props.order && props.order.destination.description && props.order.destination.description.name
                  ? props.order.destination.description.name
                  : '',
              image:
                props.order && props.order.destination.description && props.order.destination.description.image
                  ? props.order.destination.description.image
                  : '',
            },
          },
        }
      })
    }
  }, [])
  const getComponentByStep = () => {
    switch (steps) {
      case 0:
        return (
          <PreviewComponent
            onContinue={async () => {
              //set connection
              setLoading(true)

              const balance = await bloomServices.getBalance(
                {
                  dex: {
                    addresses: [address as string],
                    chains: [order.destination.chain],
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
              setBalances(newBalances)
              setLoading(false)
              setSteps(1)
            }}
            isConnected={isConnected}
            button={props.walletConnectButton}
          />
        )
      case 1:
        return (
          <CurrencySelector
            balances={balances}
            onSelect={() => {
              if (!selectedChain) throw new Error('Chain not supported')
              const chainName = getChainNameById(selectedChain.id)
              const chainId = getChainIdByName(order.destination.chain)
              if (!chainName || !chainId || !switchNetwork) {
                throw new Error('Chain not supported')
              }
              if (chainName !== order.destination.chain) {
                switchNetwork(chainId)
              }
            }}
          />
        )
      default:
        return (
          <PreviewComponent
            onContinue={async () => {
              //set connection
              setLoading(true)

              const balance = await bloomServices.getBalance(
                {
                  dex: {
                    addresses: [address as string],
                    chains: [order.destination.chain],
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
              setBalances(newBalances)
              setLoading(false)
              setSteps(1)
            }}
            isConnected={isConnected}
            button={props.walletConnectButton}
          />
        )
    }
  }
  if (loading) return <div>Loading</div>
  return getComponentByStep()
}

export default BloomCheckout
