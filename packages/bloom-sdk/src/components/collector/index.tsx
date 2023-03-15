/* eslint-disable no-case-declarations */
import React, { useContext, useEffect, useState } from 'react'
import { Chain, Order, PaymentMethods, StableCoin, Testnet } from '@bloom-trade/types'
import PreviewPage from './views/preview'
import useWallet from '../../hooks/useWallet'
import { OrderStore } from '../../store/order'
import CurrencySelector from './views/currencySelector'
import useToken from '../../hooks/useToken'
import { useAccount, useNetwork } from 'wagmi'
import { getChainNameById, getMainnetFromTestnet, getTestnetFromMainnet } from '@bloom-trade/utilities'
import { SDKContext } from '../../wrapper/context'
import SummaryComponent from './views/summary'
import useMerchant from '../../hooks/useMerchant'
import BloomServices from '@bloom-trade/services'
interface Props {
  order: Omit<Order, 'from' | 'destination'>
  onSuccess: (receipt: Order) => void
  onError: () => void
}

const Collector = (props: Props): JSX.Element => {
  const { address } = useAccount()
  const { vaults, merchant } = useMerchant()
  const order = OrderStore.useState((s) => s.order)
  useEffect(() => {
    OrderStore.update((s) => {
      //Get vault from merchant
      s.order = {
        ...s.order,
        id: props.order?.id || '',
        orderId: props.order?.orderId || '',
        date: props.order?.date || Date.now(),
        total: {
          amount: props.order?.total.amount || 0,
        },
      }
    })
  }, [])

  const { approve, transfer } = useToken()
  const { getBalance, balance } = useWallet()
  const { chain } = useNetwork()
  const [activeStep, setActiveStep] = useState(0)
  const { testnet, apiKey, apiSecret } = useContext(SDKContext)
  const bloomServices = new BloomServices(apiKey, apiSecret, {
    test: testnet,
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethods>()
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
      OrderStore.update((s) => {
        s.order = {
          ...s.order,
          destination: {
            chain: order.from?.chain as Chain,
            address: addr,
            token: order.from?.token as StableCoin,
          },
        }
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

  if (transfer.status === 'success' && transfer.receipt) props.onSuccess(order)
  if (transfer.status === 'error') props.onError()

  const steps = [
    {
      label: 'Preview order',
      component: (
        <PreviewPage
          merchant={merchant}
          onContinue={async (paymentMethod) => {
            switch (paymentMethod) {
              case 'crypto':
                await getBalance()
                break
              case 'creditCard':
                console.log('called')
                const { clientSecret } = await bloomServices.stripe.createPaymentIntent(order.total.amount, 'usd')
                console.log(clientSecret)
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
      component: (
        <CurrencySelector
          balance={balance}
          onSelect={async function (selectedToken: StableCoin): Promise<boolean | void> {
            try {
              OrderStore.update((s) => {
                s.order = {
                  ...s.order,
                  from: {
                    token: selectedToken,
                    chain: testnet
                      ? getMainnetFromTestnet(getChainNameById(chain?.id as number) as Testnet)
                      : (getChainNameById(chain?.id as number) as Chain),
                    address: address as string,
                  },
                }
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

  return <div>{steps[activeStep].component}</div>
}

export default Collector
