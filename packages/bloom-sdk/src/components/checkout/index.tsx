import React, { useContext } from 'react'
import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'
import { SDKContext } from '../../wrapper/context'

const Checkout = () => {
  const { address } = useAccount()
  const { apiKey } = useContext(SDKContext)
  console.log('My api key is', apiKey)
  console.log('My address is', address)
  return (
    <div>
      <Web3Button />
    </div>
  )
}

export default Checkout
