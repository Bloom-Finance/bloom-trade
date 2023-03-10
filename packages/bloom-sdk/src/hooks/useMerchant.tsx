import BloomServices from '@bloom-trade/services'
import Bloom from '@bloom-trade/types'
import { useContext, useEffect, useState } from 'react'
import { SDKContext } from '../wrapper/context'

export default function useMerchant() {
  const { apiKey, testnet, apiSecret } = useContext(SDKContext)
  const [vaults, setVaults] = useState<Bloom.Vault[]>()
  const bloomServices = new BloomServices(apiKey, apiSecret, {
    test: testnet,
  })
  useEffect(() => {
    if (!apiKey) throw new Error('API Key not found.')
    ;(async () => {
      const vaults = await bloomServices.getVaults()
      console.log(vaults)
      setVaults(vaults)
    })()
  }, [])

  return {
    vaults,
  }
  //staff
}
