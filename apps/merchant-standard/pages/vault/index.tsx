import type { NextPage } from 'next';
import SecuredPage from '../../src/components/layout/securedPage';
import { useEffect, useState } from 'react';
import Bloom from '@bloom-trade/types';
import { vaultsServices } from '../../src/services/vaults.services';
import { authService } from '../../src/services/auth.services';
import { useBloom, useSafe, Vault } from '@bloom-trade/react-sdk';
import BloomServices from '@bloom-trade/services';
import { useAccount, useSignMessage } from 'wagmi';
import { ethers } from 'ethers';
const VaultPage: NextPage = () => {
  const [vaults, setVaults] = useState<Bloom.Vault[]>([]);
  const [lastOwners, setLastOwners] = useState<string[]>([]);
  const { getSafeInfo } = useSafe();
  const { Connect } = useBloom();
  const { isConnected } = useAccount();
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: 'Bloom Vault challenge',
    onSuccess(data) {
      const actualAddress = ethers.utils.verifyMessage(
        'Bloom Vault challenge',
        data
      );
      if (!lastOwners.includes(actualAddress)) {
        alert('You are not an owner of this vault');
      } else {
        alert('Wohoo!! You are an owner');
      }
    },
  });
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
    })();
  }, []);
  return (
    <SecuredPage title='My Vaults' currentLink='vault'>
      {vaults.map((vault, index) => {
        return (
          <Vault
            isConnected={isConnected}
            onRequestSign={(owners) => {
              setLastOwners(owners);
              signMessage();
            }}
            walletConnectButton={<Connect />}
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
    </SecuredPage>
  );
};

export default VaultPage;
