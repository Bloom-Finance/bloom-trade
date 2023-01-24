/* eslint-disable react/jsx-key */
import { BloomOrder } from '@bloom-trade/types'

import React from 'react'

export interface CheckoutProps {
  order: Omit<BloomOrder, 'from'>
  walletConnectButton: JSX.Element
}

const BloomCheckout = (props: CheckoutProps): JSX.Element => {
  const { order } = props
  console.log(order)
  return <div>alive</div>
}

export default BloomCheckout
