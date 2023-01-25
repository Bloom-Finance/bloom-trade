/* eslint-disable react/jsx-key */
import BloomServices from '@bloom-trade/services'
import { Order } from '@bloom-trade/types'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { BloomStore } from '../../store/BloomReact'
import PreviewComponent from './views/preview'
// import BloomServices from '@bloom-trade/services'
export interface CheckoutProps {
  order: Omit<Order, 'from'>
  walletConnectButton: JSX.Element
}

const BloomCheckout = (props: CheckoutProps): JSX.Element => {
  const store = BloomStore.useState((s) => s)
  const [steps, setSteps] = useState(0)
  const bloomServices = new BloomServices(store.apiKey, {
    test: store.testnet || false,
  })
  // const { chain } = useNetwork()
  // const [balances, setBalances] = useState()
  useAccount({
    async onConnect({ address, connector, isReconnected }) {
      setSteps(1)
      //Retrieve balance from address
      const balance = await bloomServices.getBalance({
        dex: {
          addresses: [address as string],
          chains: [props.order.destination.chain],
        },
      })
      console.log(balance)
      console.log('Connected from wagmi', address, connector, isReconnected)
    },
  })
  const getComponentByStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PreviewComponent
            date={props.order.date}
            total={props.order.total}
            orderId={order.orderId}
            button={props.walletConnectButton}
            destinationDescription={props.order.destination.description}
          />
        )
      // case 1:
      //   return <CurrencySelectorComponent />
      default:
        return (
          <PreviewComponent
            date={props.order.date}
            total={props.order.total}
            orderId={order.orderId}
            button={props.walletConnectButton}
            destinationDescription={props.order.destination.description}
          />
        )
    }
  }
  const { order } = props

  console.log(setSteps)

  return getComponentByStep(steps)
}

export default BloomCheckout
