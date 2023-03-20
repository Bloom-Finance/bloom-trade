/* eslint-disable no-case-declarations */
import React, { useContext, useEffect, useState } from 'react'
import Bloom, { Asset, Chain, Order, PaymentMethods, Receipt, StableCoin, Testnet } from '@bloom-trade/types'
import PreviewPage from './views/preview'
import useWallet from '../../hooks/useWallet'
import CurrencySelector from './views/currencySelector'
import useToken from '../../hooks/useToken'
import { useAccount, useNetwork } from 'wagmi'
import { getChainNameById, getMainnetFromTestnet, getTestnetFromMainnet } from '@bloom-trade/utilities'
import { SDKContext } from '../../wrapper/context'
import SummaryComponent from './views/summary'
import useMerchant from '../../hooks/useMerchant'
import BloomServices from '@bloom-trade/services'
import CreditCard from './views/creditCard'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { customAlphabet } from 'nanoid'
import { OrderContext } from '../../order/context'

interface Props {
  order: Omit<Order, 'from' | 'destination'>
  onSuccess: (receipt: Receipt) => void
  onError: (error: Bloom.BloomError<any>) => void
}

const Collector = (props: Props): JSX.Element => {
  const { address } = useAccount()
  const { vaults, merchant } = useMerchant()
  const [disabledPaymentMethods, setDisabledPaymentMethods] = useState<PaymentMethods[]>([])
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [order, setOrder] = useState<Order>({
    ...props.order,
  })
  const [collectorContext, setCollectorContext] = useState<{
    type: 'crypto' | 'creditCard' | 'bankAccount'
    status: 'processing' | 'completed' | 'failed' | 'cancelled' | 'idle'
    txHash?: string
    chain?: Chain
    token?: Asset
  }>({
    type: 'crypto',
    status: 'idle',
  })
  useEffect(() => {
    if (!merchant) return
    ;(async () => {
      if (!merchant?.plugins) {
        setDisabledPaymentMethods(['creditCard', 'bankAccount', 'crypto'])
        return
      }
      const creditCard = merchant.plugins.find((p) => p.id === 'creditCard')
      if (!creditCard || !creditCard.auth) {
        setDisabledPaymentMethods(['creditCard'])
        return
      }
      const stripeResolved = await loadStripe(creditCard.auth.apiKey)
      setStripe(stripeResolved)
    })()
  }, [merchant])

  const { approve, transfer } = useToken()
  const { getBalance, balance } = useWallet()
  const { chain } = useNetwork()
  const [activeStep, setActiveStep] = useState(0)
  const { testnet, apiKey, apiSecret } = useContext(SDKContext)
  const bloomServices = new BloomServices(apiKey, apiSecret, {
    test: testnet,
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethods>()
  const [clientSecret, setClientSecret] = useState<string>()
  useEffect(() => {
    if (
      activeStep === 2 &&
      !transfer.waitingForUserResponse &&
      !transfer.waitingForBlockchain &&
      !transfer.error &&
      order.from
    ) {
      if (!vaults) throw new Error('Merchant has no vaults configured.')
      const addr = vaults.find(
        (v) => v.chain === (testnet ? getTestnetFromMainnet(order.from?.chain as Chain) : order.from?.chain),
      )?.address
      if (!addr) throw new Error('Vault not found.')
      setOrder({
        ...order,
        destination: {
          chain: order.from?.chain as Chain,
          address: addr,
          token: order.from?.token as StableCoin,
        },
      })
      transfer.prepare(
        {
          token: order.from?.token,
        },
        {
          chain: order.from.chain,
          address: addr, //get vault
          token: order.from.token,
        },
        order.total.amount.toString(),
      )
    }
  }, [activeStep])

  useEffect(() => {
    if (activeStep === 1 && !approve.waitingForUserResponse && !approve.waitingForBlockchain && !approve.error) {
      setActiveStep(2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approve.waitingForUserResponse, approve.waitingForBlockchain])

  if (transfer.status === 'success' && transfer.receipt) {
    const receipt: Receipt = {
      id: customAlphabet('1234567890abcdef', 10)(),
      txHash: transfer.txHash,
      createdAt: order.date,
      chain: order.from?.chain as Chain,
      type: 'crypto',
      currency: order.from?.token as Asset,
      status: 'completed',
      total: {
        ...order.total,
      },
    }
    props.onSuccess(receipt)
  }

  if (transfer.status === 'error')
    props.onError({
      msg: transfer.error?.message || 'Unknown error',
      isError: true,
    })

  const steps = [
    {
      label: 'Preview order',
      component: (
        <PreviewPage
          disabledPaymentMethods={disabledPaymentMethods}
          merchant={merchant}
          onContinue={async (paymentMethod) => {
            setSelectedPaymentMethod(paymentMethod)
            switch (paymentMethod) {
              case 'crypto':
                await getBalance()
                break
              case 'creditCard':
                const { clientSecret } = await bloomServices.stripe.createPaymentIntent(order.total.amount, 'usd')
                setClientSecret(clientSecret)
                break
              default:
                break
            }
            setActiveStep(1)
          }}
        />
      ),
    },
    {
      label: 'Select your coins',
      component:
        selectedPaymentMethod === 'crypto' ? (
          <CurrencySelector
            balance={balance}
            onSelect={async function (selectedToken: StableCoin): Promise<boolean | void> {
              try {
                setOrder({
                  ...order,
                  from: {
                    token: selectedToken,
                    chain: testnet
                      ? getMainnetFromTestnet(getChainNameById(chain?.id as number) as Testnet)
                      : (getChainNameById(chain?.id as number) as Chain),
                    address: address as string,
                  },
                })
                //Prepare contract and gas
                approve.prepare(
                  selectedToken,
                  getChainNameById(chain?.id as number),
                  props.order.total.amount.toString(),
                  'transfers',
                )
                return true
              } catch (e) {
                console.log(e)
                throw new Error('Function not implemented.')
              }
            }}
            onApprove={function (): void {
              approve.execute()
            }}
          />
        ) : !clientSecret ? (
          'Loading...'
        ) : (
          <Elements
            options={{
              clientSecret: clientSecret,
              appearance: {
                theme: 'stripe',
              },
            }}
            stripe={stripe}
          >
            <CreditCard
              clientSecret={clientSecret}
              onError={(error) => {
                props.onError({
                  msg: error,
                  isError: true,
                })
              }}
              onSuccess={(payment) => {
                const receipt: Receipt = {
                  id: customAlphabet('1234567890abcdef', 10)(),
                  createdAt: order.date,
                  type: 'creditCard',
                  currency: payment.currency,
                  status: payment.status === 'succeeded' ? 'completed' : 'failed',
                  total: {
                    ...order.total,
                  },
                }
                props.onSuccess(receipt)
              }}
            />
          </Elements>
        ),
    },
    {
      label: 'Transfer',
      component: (
        <SummaryComponent
          order={order}
          actions={{
            button: (
              <button
                onClick={async () => {
                  await transfer.execute()
                }}
              >
                Transfer
              </button>
            ),
          }}
        />
      ),
    },
  ]

  return (
    <OrderContext.Provider
      value={{
        status: collectorContext.status,
        type: collectorContext.type,
        txHash: collectorContext.txHash,
        chain: collectorContext.chain,
        token: collectorContext.token,
      }}
    >
      {steps[activeStep].component}
    </OrderContext.Provider>
  )
}

export default Collector
