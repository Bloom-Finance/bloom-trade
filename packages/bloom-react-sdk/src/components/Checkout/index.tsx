/* eslint-disable react/jsx-key */
import { BloomOrder, Testnet } from '@bloom-trade/types'

import React from 'react'
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
  const { order } = props
  return (
    <PreviewComponent
      date={props.order.date}
      total={props.order.total}
      orderId={order.orderId}
      walletConnectButton={props.walletConnectButton}
      destinationDescription={props.order.destination.description}
    />
  )
}

export default BloomCheckout
