/* eslint-disable react/jsx-key */
import { Chain } from '@bloom-trade/types'
import React from 'react'
export interface Props {
  status: 'pending' | 'failed' | 'completed'
  msg: string
  txHash: string
  chain: Chain
}

const WaitingForBlockchain = (props: Props): JSX.Element => {
  console.log(props)
  return <div>test</div>
}

export default WaitingForBlockchain
