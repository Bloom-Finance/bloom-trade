/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-extra-semi */
import { useContext, useEffect, useState } from 'react'
import { SDKContext } from '../wrapper/context'
import { Vault } from '@bloom-trade/types'
import BloomServices from '@bloom-trade/services'
export default function useMerchant() {
  const { test, apiUrl } = useContext(SDKContext)
  const bloomServices = new BloomServices({
    test,
    apiUrl,
  })
  const [vaults, setVaults] = useState<Vault[]>()
  useEffect(() => {
    ;(async () => {
      const { vaults } = await bloomServices.getVaults()
      setVaults(vaults)
    })()
  }, [bloomServices])

  return {
    vaults,
  }
}
