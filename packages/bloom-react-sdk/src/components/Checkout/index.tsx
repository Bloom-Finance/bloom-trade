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
export interface CheckoutProps {
  order: Omit<Order, 'from'>
  walletConnectButton: JSX.Element
}

const BloomCheckout = (props: CheckoutProps): JSX.Element => {
  const store = BloomStore.useState((s) => s)
  const [steps, setSteps] = useState(0)
  const { switchNetwork } = useSwitchNetwork()
  const [loading, setLoading] = useState(false)
  const [balances, setBalances] = useState<any[]>([])
  const bloomServices = new BloomServices(store.apiKey, {
    test: store.testnet || false,
  })
  const { selectedChain, setSelectedChain } = useWeb3ModalNetwork()
  useEffect(() => {
    setSelectedChain(getWagmiInstanceByChainName(props.order.destination.chain))
  }, [])
  useAccount({
    async onConnect({ address, isReconnected }) {
      if (isReconnected) return
      setLoading(true)
      const balance = await bloomServices.getBalance(
        {
          dex: {
            addresses: [address as string],
            chains: [props.order.destination.chain],
          },
        },
        {
          onlyStableCoins: true,
        },
      )
      balance.forEach((b) => {
        setBalances((prev) => [
          ...prev,
          {
            currency: b.asset,
            amount: b.balance,
          },
        ])
      })
      setLoading(false)
      setSteps(1)
    },
  })
  const getComponentByStep = () => {
    switch (steps) {
      case 0:
        return (
          <PreviewComponent
            date={props.order.date}
            total={props.order.total}
            orderId={props.order.orderId}
            button={props.walletConnectButton}
            destinationDescription={props.order.destination.description}
          />
        )
      case 1:
        return (
          <CurrencySelector
            balances={balances}
            onSelect={() => {
              if (!selectedChain) throw new Error('Chain not supported')
              const chainName = getChainNameById(selectedChain.id)
              const chainId = getChainIdByName(props.order.destination.chain)
              if (!chainName || !chainId || !switchNetwork) {
                throw new Error('Chain not supported')
              }
              if (chainName !== props.order.destination.chain) {
                switchNetwork(chainId)
              }
            }}
          />
        )
      default:
        return (
          <PreviewComponent
            date={props.order.date}
            total={props.order.total}
            orderId={props.order.orderId}
            button={props.walletConnectButton}
            destinationDescription={props.order.destination.description}
          />
        )
    }
  }
  if (loading) return <div>Loading</div>
  return getComponentByStep()
}

export default BloomCheckout
