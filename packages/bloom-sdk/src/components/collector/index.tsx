import React, { useContext, useEffect, useState } from 'react'
import { Chain, Order, StableCoin, Testnet } from '@bloom-trade/types'
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
interface Props {
  order: Omit<Order, 'from' | 'destination'>
  onSuccess: () => void
  onError: () => void
}

const Collector = (props: Props): JSX.Element => {
  const { address } = useAccount()
  const { vaults } = useMerchant()
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
  const { testnet } = useContext(SDKContext)
  useEffect(() => {
    if (
      activeStep === 2 &&
      !transfer.waitingForUserResponse &&
      !transfer.waitingForBlockchain &&
      !transfer.error &&
      order.from
    ) {
      if (!vaults) throw new Error('Merchant has no vaults configured.')
      const addr = vaults.find((v) => v.chain === order.from?.chain)?.address
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

  const steps = [
    {
      label: 'Preview order',
      component: (
        <PreviewPage
          onContinue={async (paymentMethod) => {
            if (paymentMethod === 'crypto') {
              await getBalance()
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
            setActiveStep(2)
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
                  props.onSuccess()
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
