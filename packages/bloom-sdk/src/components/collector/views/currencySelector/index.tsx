import { StableCoin } from '@bloom-trade/types'
import { getTokenDescriptionBySymbol, getTokenIconBySymbol } from '@bloom-trade/utilities'
import React from 'react'

interface Props {
  amountLimit?: string
  balance: {
    currency: StableCoin
    amount: string
  }[]
  onSelect: (selectedToken: StableCoin) => Promise<boolean | void>
  onApprove: () => void
}

const CurrencySelector = (props: Props): JSX.Element => {
  const [selectedToken, setSelectedToken] = React.useState<StableCoin | undefined>(undefined)

  if (props.balance.length === 0) return <div>Sorry but you dont have enough balance to pay for TX</div>

  return (
    <div>
      {props.balance.length > 0 ? (
        <>
          {props.balance.map((balance) => {
            return (
              <div key={balance.currency}>
                <div
                  onClick={async () => {
                    if (!props.amountLimit || Number(props.amountLimit) <= Number(balance.amount)) {
                      const shouldSetToken = await props.onSelect(balance.currency)
                      if (shouldSetToken) setSelectedToken(balance.currency)
                    }
                  }}
                  style={{
                    background:
                      props.amountLimit && Number(props.amountLimit) > Number(balance.amount)
                        ? 'rgba(162, 0, 29, 0.2)'
                        : 'none',
                  }}
                >
                  <div>
                    <image href={getTokenIconBySymbol(balance.currency)} />
                  </div>
                  <div>
                    <label>{balance.currency.toUpperCase()}</label>
                    <label>{getTokenDescriptionBySymbol(balance.currency)}</label>
                  </div>
                </div>
              </div>
            )
          })}
          <button
            disabled={!selectedToken}
            onClick={() => {
              selectedToken && props.onApprove()
            }}
          >
            Approve {selectedToken?.toUpperCase()}
          </button>
        </>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h2>No balances</h2>
        </div>
      )}
    </div>
  )
}

export default CurrencySelector
