import { Asset, Chain, Testnet } from '@bloom-trade/types'
import React from 'react'

export interface Props {
  address: string
  owners: Array<string>
  chain: Chain | Testnet
  qrCodeLogoImage: string
  balance: {
    asset: Asset
    amount: string
  }[]
}

const VaultDetail = (props: Props): JSX.Element => {
  return <div>Alive</div>
}

export default VaultDetail
