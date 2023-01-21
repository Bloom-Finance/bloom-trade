import React from 'react'
import { useWeb3ModalNetwork, Web3Button } from '@web3modal/react'
import { Testnet } from '@bloom-trade/types'
import { getWagmiInstanceByChainName } from '@bloom-trade/utilities'
interface Props {
  icon?: 'show' | 'hide'
  label?: string
  useTestnet?: {
    testnet: boolean
    chain: Testnet
  }
}
/**
 * A React component that renders a Wallet connect button to connect with your wallet.
 * @param {Props} props - Props
 * @returns A Web3Button component with the icon and label props passed in.
 */

const ConnectButton = (props: Props): JSX.Element => {
  const { setSelectedChain } = useWeb3ModalNetwork()
  if (props.useTestnet && props.useTestnet.testnet) {
    setSelectedChain(getWagmiInstanceByChainName(props.useTestnet.chain))
  }
  return (
    <div>
      <Web3Button icon={props.icon} label={props.label} />
    </div>
  )
}

export default ConnectButton
