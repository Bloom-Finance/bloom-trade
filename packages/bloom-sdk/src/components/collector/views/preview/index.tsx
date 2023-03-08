import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import useWallet from '../../../../hooks/useWallet'

//In this component we are in charged of selecting which type of payment he is going to perform
interface Props {
  onContinue: (paymentMethod: 'crypto' | 'credit card') => void
}
const PreviewPage = (props: Props): JSX.Element => {
  const [hasMounted, setHasMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>('crypto')
  const [hasChosenPaymentMethod, setHasChosenPaymentMethod] = useState(false)
  const { isConnected } = useAccount()
  const plugins = [{ id: 'crypto' }, { id: 'credit card' }]
  useEffect(() => {
    setHasMounted(true)
  }, [])
  const { Connect } = useWallet()
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
