import React, { useState } from 'react'
import { Order } from '@bloom-trade/types'
import { useAccount } from 'wagmi'
import { Web3Button } from '@web3modal/react'
import useWallet from '../../hooks/useWallet'
import PreviewPage from './views/preview'

interface Props {
  order: Omit<Order, 'from'>
  onSuccess: () => void
  onError: () => void
}

const Collector = (props: Props): JSX.Element => {
  // const { approve, transfer } = useToken()
  // console.log(balance)
  const [activeStep, setActiveStep] = useState(0)
  // const order = OrderStore.useState((s) => s.order)
  const steps = [
    {
      component: (
        <PreviewPage
          onContinue={() => {
            setActiveStep(1)
          }}
        />
      ),
    },
    {
      component: <>Here I have to select coins</>,
    },
  ]
  // useEffect(() => {
  //   OrderStore.update((s) => {
  //     s.order = {
  //       id: props.order?.id || '',
  //       orderId: props.order?.orderId || '',
  //       date: props.order?.date || Date.now(),
  //       total: {
  //         amount: props.order?.total.amount || 0,
  //       },
  //       destination: {
  //         chain: props.order?.destination.chain || 'eth',
  //         address: props.order?.destination.address || '',
  //         token: props.order?.destination.token || 'dai',
  //         description: {
  //           name: props.order?.destination.description?.name || '',
  //           image: props.order?.destination.description?.image || '',
  //         },
  //       },
  //     }
  //   })
  // }, [])

  return <div>{steps[activeStep].component}</div>
}

export default Collector
