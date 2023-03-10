import { Order, Testnet } from '@bloom-trade/types'
import { capitalize, formatWalletAddress, getTestnetFromMainnet } from '@bloom-trade/utilities'
import React, { useContext } from 'react'
import { SDKContext } from '../../../../wrapper/context'

export interface Props {
  order: Order
  actions: {
    button: JSX.Element
  }
}

const SummaryComponent = (props: Props): JSX.Element => {
  const { testnet } = useContext(SDKContext)
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <div>
        <div>
          {props.order.destination.description?.image && <img src={props.order.destination.description.image} />}
        </div>
        <div>
          <label>
            {props.order.destination.description?.name || formatWalletAddress(props.order.destination.address)}
          </label>
          <label>
            {`${capitalize(props.order.destination.chain)} ${
              testnet ? `(${getTestnetFromMainnet(props.order.destination.chain) as Testnet})` : ''
            }, ${props.order.destination.token.toUpperCase()}`}
          </label>
        </div>
      </div>
      <button>{props.actions.button}</button>
    </div>
  )
}

export default SummaryComponent
