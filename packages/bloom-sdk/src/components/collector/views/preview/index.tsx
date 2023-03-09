import { Testnet } from '@bloom-trade/types'
import { getWagmiInstanceByChainName, getTestnetFromMainnet } from '@bloom-trade/utilities'
import { useWeb3Modal } from '@web3modal/react'
import React, { useContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import useWallet from '../../../../hooks/useWallet'
import { OrderStore } from '../../../../store/order'
import { SDKContext } from '../../../../wrapper/context'

//In this component we are in charged of selecting which type of payment he is going to perform
interface Props {
  onContinue: (paymentMethod: 'crypto' | 'credit card') => void
}
const PreviewPage = (props: Props): JSX.Element => {
  const [hasMounted, setHasMounted] = useState(false)
  const { checkChain, Connect } = useWallet()
  const [paymentMethod, setPaymentMethod] = useState<string>('crypto')
  const { setDefaultChain } = useWeb3Modal()
  const [hasChosenPaymentMethod, setHasChosenPaymentMethod] = useState(false)
  const { isConnected } = useAccount()
  const order = OrderStore.useState((s) => s.order)
  const { testnet } = useContext(SDKContext)
  const plugins = [{ id: 'crypto' }, { id: 'credit card' }]
  useEffect(() => {
    if (order.destination.chain) {
      setDefaultChain(
        getWagmiInstanceByChainName(
          testnet ? (getTestnetFromMainnet(order.destination.chain) as Testnet) : order.destination.chain,
        ),
      )
    }
    setHasMounted(true)
  }, [])
  return (
    <>
      {!hasChosenPaymentMethod || !paymentMethod ? (
        <>
          <h2>Choose your payment method</h2>
          <select
            onChange={(e) => {
              setPaymentMethod(e.target.value)
            }}
          >
            {plugins.map((plugin) => (
              <option key={plugin.id} value={plugin.id}>
                {plugin.id}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setHasChosenPaymentMethod(true)
            }}
          >
            continue
          </button>
        </>
      ) : (
        <div>
          <h2>Payment method: {paymentMethod}</h2>
          {paymentMethod === 'crypto' && !isConnected && hasMounted ? (
            <Connect />
          ) : (
            <button
              onClick={() => {
                if (paymentMethod === 'crypto') {
                  const { isChainCorrect, change } = checkChain(order.destination.chain)
                  if (!isChainCorrect) change()
                }
                props.onContinue(paymentMethod as 'crypto')
              }}
            >
              Continue
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default PreviewPage
