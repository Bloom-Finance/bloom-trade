import BloomServices from '@bloom-trade/services'
import Bloom, { User } from '@bloom-trade/types'
import { useContext, useEffect, useState } from 'react'
import { SDKContext } from '../wrapper/context'

export default function useMerchant() {
  const { apiKey, testnet, apiSecret } = useContext(SDKContext)
  const [vaults, setVaults] = useState<Bloom.Vault[]>()
  const [merchant, setMerchant] = useState<User>()
  const bloomServices = new BloomServices(apiKey, apiSecret, {
    test: testnet,
  })
  useEffect(() => {
    if (!apiKey) throw new Error('API Key not found.')
    ;(async () => {
      const { vaults } = await bloomServices.getVaults()
      const { user } = await bloomServices.getUser()
      setMerchant(user)
      setVaults(vaults)
    })()
  }, [])

  return {
    vaults,
    merchant,
  }
  //staff
}
