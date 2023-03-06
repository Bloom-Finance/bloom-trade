import { useSafe } from '@bloom-trade/ui';
import BloomServices from '@bloom-trade/services';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../../components/loadingScreen';
import { authService } from '../../../services/auth.services';
import { vaultsServices } from '../../../services/vaults.services';
import Bloom from '@bloom-trade/types';

const withPreCheckVaultDetail = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const PreFetch = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [vault, setVault] = useState<Bloom.Vault>();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [pendingTxs, setPendingTxs] = useState<any[]>([]);
    const { getSafeInfo, getAllTransactions, getPendingTransactions } =
      useSafe();
    const {
      query: { id },
    } = useRouter();
    useEffect(() => {
      (async () => {
        if (!id || id instanceof Array) return;
        const vault = await vaultsServices.getVault(id);
        const bloomServices = new BloomServices(
          authService.getToken() as string,
          {
            test: process.env.MODE === 'DEV' ? true : false,
          }
        );
        const safeInfo = await getSafeInfo(vault.chain, vault.address);
        const txs = await getAllTransactions(
          vault.chain,
          vault.address,
          {
            executed: true,
            queued: false,
          },
          {
            infura: {
              projectId: process.env.INFURA_PROJECT_ID as string,
            },
          }
        );

        const pendingTxs = await getPendingTransactions(
          vault.chain,
          vault.address,
          {
            infura: {
              projectId: process.env.INFURA_PROJECT_ID as string,
            },
          }
        );
        setPendingTxs(pendingTxs);
        setTransactions(txs);
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
        setLoading(false);
      })();
    }, [id]);
    return loading ? (
      <LoadingScreen />
    ) : (
      <Component
        transactions={transactions}
        pendingTxs={pendingTxs}
        vault={vault}
        {...props}
      />
    );
  };

  return PreFetch;
};

export default withPreCheckVaultDetail;
