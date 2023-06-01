/* eslint-disable @typescript-eslint/no-extra-semi */
import BloomServices from '@bloom-trade/services'
import { Asset, Chain, Order, PaymentMethods, Receipt, StableCoin, Testnet } from '@bloom-trade/types'
import { getChainNameById, getMainnetFromTestnet, getTestnetFromMainnet } from '@bloom-trade/utilities'
import { customAlphabet } from 'nanoid'
import React, { useContext, useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import useMerchant from '../../hooks/useMerchant'
import useToken from '../../hooks/useToken'
import useWallet from '../../hooks/useWallet'
import { OrderContext } from '../../order/context'
import { SDKContext } from '../../wrapper/context'
import CurrencySelector from './views/currencySelector'
import PreviewPage from './views/preview'
import SummaryComponent from './views/summary'

interface Props {
  orderId: string
  onSuccess: (receipt: Receipt) => void
  onError: (error: Bloom.BloomError<any>) => void
}

const Collector = (props: Props): JSX.Element => {
  const { address } = useAccount()
  const { vaults } = useMerchant()
  const { approve, transfer } = useToken()
  const { getBalance, balance } = useWallet()
  const { chain } = useNetwork()
  const [activeStep, setActiveStep] = useState(0)
  const { test, apiUrl } = useContext(SDKContext)
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

  const bloomServices = new BloomServices({
    test,
    apiUrl,
  })

  const [order, setOrder] = useState<Order>()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethods>()
  useEffect(() => {
    ;(async () => {
      if (!props.orderId) return
      const order = await bloomServices.getOrder(props.orderId)
      setOrder(order)
    })()
  }, [props.orderId])
  console.log(order)
  useEffect(() => {
    if (
      activeStep === 2 &&
      !transfer.waitingForUserResponse &&
      !transfer.waitingForBlockchain &&
      !transfer.error &&
      order?.from
    ) {
      if (!vaults) throw new Error('Merchant has no vaults configured.')
      const addr = vaults.find(
        (v) => v.chain === (test ? getTestnetFromMainnet(order.from?.chain as Chain) : order.from?.chain),
      )?.address
      if (!addr) throw new Error('Vault not found.')

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

  if (transfer.status === 'success' && transfer.receipt && order) {
    const receipt: Receipt = {
      id: customAlphabet('1234567890abcdef', 10)(),
      txHash: transfer.txHash,
      createdAt: order?.iat,
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
          disabledPaymentMethods={['bankAccount', 'creditCard']}
          onContinue={async (paymentMethod) => {
            setSelectedPaymentMethod(paymentMethod)
            switch (paymentMethod) {
              case 'crypto':
                await getBalance()
                break
              // case 'creditCard':
              //   const { clientSecret } = await bloomServices.stripe.createPaymentIntent(order.total.amount, 'usd')
              //   setClientSecret(clientSecret)
              //   break
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
                if (!vaults) throw new Error('Merchant has no vaults configured.')
                if (!order) throw new Error('Order not found.')
                const from = {
                  token: selectedToken,
                  chain: test
                    ? getMainnetFromTestnet(getChainNameById(chain?.id as number) as Testnet)
                    : (getChainNameById(chain?.id as number) as Chain),
                  address: address as string,
                }
                const addr = vaults.find(
                  (v) => v.chain === (test ? getTestnetFromMainnet(from.chain as Chain) : from.chain),
                )?.address
                if (!addr) throw new Error('Vault not found.')
                setOrder({
                  ...(order as Order),
                  from,
                  destination: {
                    chain: from.chain,
                    address: addr,
                    token: from.token as StableCoin,
                  },
                })

                //Prepare contract and gas
                approve.prepare(
                  selectedToken,
                  getChainNameById(chain?.id as number),
                  (order as Order).total.amount.toString() as string,
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
        ) : (
          <>Stripe option disabled</>
          // <Elements
          //   options={{
          //     clientSecret: clientSecret,
          //     appearance: {
          //       theme: 'stripe',
          //     },
          //   }}
          //   stripe={stripe}
          // >
          //   <CreditCard
          //     clientSecret={clientSecret}
          //     onError={(error) => {
          //       props.onError({
          //         msg: error,
          //         isError: true,
          //       })
          //     }}
          //     onSuccess={(payment) => {
          //       const receipt: Receipt = {
          //         id: customAlphabet('1234567890abcdef', 10)(),
          //         createdAt: order.date,
          //         type: 'creditCard',
          //         currency: payment.currency,
          //         status: payment.status === 'succeeded' ? 'completed' : 'failed',
          //         total: {
          //           ...order.total,
          //         },
          //       }
          //       props.onSuccess(receipt)
          //     }}
          //   />
          // </Elements>
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
