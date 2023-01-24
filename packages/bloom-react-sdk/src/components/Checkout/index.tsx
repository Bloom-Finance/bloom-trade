/* eslint-disable react/jsx-key */
import { BloomOrder, Testnet } from '@bloom-trade/types'

import React, { useState } from 'react'
import PreviewComponent from './views/preview'

export interface CheckoutProps {
  order: Omit<BloomOrder, 'from'>
  walletConnectButton: JSX.Element
  useTestnet?: {
    testnet: boolean
    chain: Testnet
  }
}

const BloomCheckout = (props: CheckoutProps): JSX.Element => {
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
  // 0 ->Preview of order with wallet connect
  // 1 -> Choose currency token
  // 3 -> Preview of order with pay button
  // 4 -> Approval of token
  const [steps, setSteps] = useState(0)
  console.log(setSteps)

  return getComponentByStep(steps)
}

export default BloomCheckout
