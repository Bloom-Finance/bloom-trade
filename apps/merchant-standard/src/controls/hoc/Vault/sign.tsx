import { useSafe } from '@bloom-trade/react-sdk';
import BloomServices from '@bloom-trade/services';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../../components/loadingScreen';
import { authService } from '../../../services/auth.services';
import { vaultsServices } from '../../../services/vaults.services';
import Bloom from '@bloom-trade/types';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';

const withPreCheckSignVault = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const PreFetch = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [vault, setVault] = useState<Bloom.Vault>();
    const [transaction, setTransaction] =
      useState<SafeMultisigTransactionResponse>();
    const { getSafeInfo, getTransactionInfo } = useSafe();
    const {
      query: { tx, vault: vaultQuery },
    } = useRouter();
    useEffect(() => {
      (async () => {
        if (!tx || tx instanceof Array) return;
        if (!vaultQuery || vaultQuery instanceof Array) return;
        const vault = await vaultsServices.getVault(vaultQuery);
        const txInfo = await getTransactionInfo(tx, vault.chain, {
          infura: {
            projectId: process.env.INFURA_PROJECT_ID as string,
          },
        });
        const bloomServices = new BloomServices(
          authService.getToken() as string,
          {
            test: process.env.MODE === 'DEV' ? true : false,
          }
        );
        const safeInfo = await getSafeInfo(vault.chain, vault.address, {
          infura: {
            projectId: process.env.INFURA_PROJECT_ID as string,
          },
        });

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
        setVault(processedVault);
        setTransaction(txInfo);
        setLoading(false);
      })();
    }, [tx, vaultQuery]);
    return loading ? (
      <LoadingScreen />
    ) : (
      <Component tx={transaction} vault={vault} {...props} />
    );
  };

  return PreFetch;
};

export default withPreCheckSignVault;
