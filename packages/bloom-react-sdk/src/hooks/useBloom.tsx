import { Testnet } from '@bloom-trade/types'
import { useWeb3ModalNetwork } from '@web3modal/react'
// import { getWagmiInstanceByChainName } from '@bloom-trade/utilities'
import { goerli } from 'wagmi/chains'
export default function useBloom(params?: {
  useTestnet?: {
    testnet: boolean
    chain: Testnet
  }
}) {
  const { setSelectedChain } = useWeb3ModalNetwork()
  console.log(params)
  const Transfer = () => {
    setSelectedChain(goerli)
    // //STAFF: Add your code here
    // const chain = selectedChain?.network as Chain | Testnet
    // console.log(selectedChain, to)
    // if (chain !== to.chain) {
    //   setSelectedChain(getWagmiInstanceByChainName(to.chain))
    //   return
    // }
  }
  return {
    Transfer,
  }
}
