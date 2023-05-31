import { PaymentMethod, PaymentMethods, User } from '@bloom-trade/types'
import { getChainNameById, isTestnet } from '@bloom-trade/utilities'
import React, { useContext, useEffect, useState } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import useWallet from '../../../../hooks/useWallet'
import { SDKContext } from '../../../../wrapper/context'
//In this component we are in charged of selecting which type of payment he is going to perform
interface Props {
  onContinue: (paymentMethod: PaymentMethods) => void
  disabledPaymentMethods?: PaymentMethods[]
}
const PreviewPage = (props: Props): JSX.Element => {
  const [hasMounted, setHasMounted] = useState(false)
  const { Connect } = useWallet()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>('crypto')
  const [hasChosenPaymentMethod, setHasChosenPaymentMethod] = useState(false)
  const { isConnected } = useAccount()
  const { switchNetwork } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { test } = useContext(SDKContext)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <>
      {!hasChosenPaymentMethod || !paymentMethod ? (
        <>
          <h2>Choose your payment method</h2>
          <select
            onChange={(e) => {
              setPaymentMethod(e.target.value as PaymentMethod)
            }}
          >
            {[{ enabled: true, id: 'crypto', auth: undefined }].map((plugin) => {
              if (
                !plugin.enabled ||
                (plugin.id === 'creditCard' && !plugin.auth) ||
                props.disabledPaymentMethods?.includes(plugin.id as PaymentMethods)
              )
                return
              return (
                <option key={plugin.id} value={plugin.id}>
                  {plugin.id}
                </option>
              )
            })}
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
            <>
              {paymentMethod === 'crypto' && isConnected && chain && <h3>Connected to {getChainNameById(chain.id)}</h3>}
              <button
                onClick={() => {
                  !test && isTestnet(chain?.id as number) && switchNetwork && switchNetwork(1)
                  props.onContinue(paymentMethod)
                }}
              >
                Continue
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default PreviewPage
