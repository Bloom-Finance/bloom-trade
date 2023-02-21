import type { NextPage } from 'next';
import SecuredPage from '../../src/components/layout/securedPage';
import { useEffect, useState } from 'react';
import Bloom from '@bloom-trade/types';
import { Vault } from '@bloom-trade/react-sdk';
import { vaultsServices } from '../../src/services/vaults.services';
import { authService } from '../../src/services/auth.services';
import { useSafe } from '@bloom-trade/react-sdk';
const VaultPage: NextPage = () => {
  const [vaults, setVaults] = useState<Bloom.Vault[]>([]);
  const { getSafeInfo } = useSafe();
  useEffect(() => {
    (async () => {
      const user = await authService.getUserSession();
      if (!user) throw new Error('User not found');
      const vaults = await vaultsServices.getVaultsByUserId(user.userId);
      const processedVaults = await Promise.all(
        vaults.map(async (vault) => {
          const safeInfo = await getSafeInfo(vault.address, vault.chain);
          return {
            ...vault,
            owners: safeInfo.owners,
            threshold: safeInfo.threshold,
          };
        })
      );
      setVaults(processedVaults);
    })();
  }, []);
  return (
    <SecuredPage title='My Vaults' currentLink='vault'>
      {vaults.map((vault) => {
        return (
          <Vault
            address={vault.address as `0x${string}`}
            chain={vault.chain}
            owners={vault.owners as string[]}
          />
        );
      })}
    </SecuredPage>
  );
};

export default VaultPage;
