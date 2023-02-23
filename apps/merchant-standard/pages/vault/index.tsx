import type { NextPage } from 'next';
import SecuredPage from '../../src/components/layout/securedPage';
import { useEffect, useState } from 'react';
import Bloom from '@bloom-trade/types';
import { vaultsServices } from '../../src/services/vaults.services';
import { authService } from '../../src/services/auth.services';
import { useSafe, Vault, FindLoader } from '@bloom-trade/react-sdk';
import BloomServices from '@bloom-trade/services';
import { useRouter } from 'next/router';
import { Stack } from '@mui/system';
import { Typography } from '@mui/material';

const VaultPage: NextPage = () => {
  const [vaults, setVaults] = useState<Bloom.Vault[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { getSafeInfo } = useSafe();

  useEffect(() => {
    (async () => {
      const user = await authService.getUserSession();
      if (!user) throw new Error('User not found');
      const vaults = await vaultsServices.getVaultsByUserId(user.userId);
      const bloomServices = new BloomServices(
        authService.getToken() as string,
        {
          test: process.env.MODE === 'DEV' ? true : false,
        }
      );
      const processedVaults = await Promise.all(
        vaults.map(async (vault) => {
          const safeInfo = await getSafeInfo(vault.address, vault.chain);
          const balances = await bloomServices.getBalance({
            dex: {
              chains: [vault.chain === 'goerli' ? 'eth' : vault.chain],
              addresses: [vault.address],
            },
          });
          let processedVault: Bloom.Vault = {
            ...vault,
            owners: safeInfo.owners,
            threshold: safeInfo.threshold,
            balance: [],
          };
          balances.forEach((balance) => {
            processedVault.balance.push({
              asset: balance.asset,
              amount: balance.balance,
            });
          });
          return processedVault;
        })
      );
      setVaults(processedVaults);
      setLoading(false);
    })();
  }, []);

  return (
    <SecuredPage title='My Vaults' currentLink='vaults'>
      <>
        {loading && (
          <Stack
            justifyContent='center'
            alignItems={'center'}
            spacing={2}
            direction={'column'}
          >
            <FindLoader color='#FF0083' />
            <Typography>Searching your vaults...</Typography>
          </Stack>
        )}
        {vaults.length === 0 && !loading && (
          <div className='flex flex-col items-center justify-center h-full'>
            <div className='text-2xl font-bold text-center'>
              You don't have any vaults yet
            </div>
            <div className='text-lg text-center'>
              Create a vault to start trading
            </div>
            <button
              onClick={() => {
                router.push('/vault/create');
              }}
              className='px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
            >
              Create Vault
            </button>
          </div>
        )}
        {vaults.map((vault, index) => {
          return (
            <Vault
              onSeeVault={() => {
                router.push(`/vault/${vault.id}`);
              }}
              key={index}
              qrCodeLogoImage={
                'https://merchant.bloom.trade/apple-touch-icon.png'
              }
              address={vault.address as `0x${string}`}
              chain={vault.chain}
              owners={vault.owners as string[]}
              balance={vault.balance}
            />
          );
        })}
      </>
    </SecuredPage>
  );
};

export default VaultPage;
