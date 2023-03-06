import { useSafe } from '@bloom-trade/ui';
import BloomServices from '@bloom-trade/services';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../../components/loadingScreen';
import { authService } from '../../../services/auth.services';
import Bloom, { Chain } from '@bloom-trade/types';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';

const withPreCheckSignVault = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const PreFetch = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [vault, setVault] = useState<{
      address: string;
      chain: Chain | 'goerli';
      owners: string[];
      threshold: number;
      balance: { asset: string; amount: string }[];
    }>();
    const [transaction, setTransaction] =
      useState<SafeMultisigTransactionResponse>();
    const { getSafeInfo, getTransactionInfo } = useSafe();
    const {
      query: { tx, address, chain: queryChain },
    } = useRouter();
    useEffect(() => {
      (async () => {
        if (!tx || tx instanceof Array) return;
        if (!address || address instanceof Array) return;
        if (!queryChain || queryChain instanceof Array) return;
        const chain = queryChain as Chain | 'goerli';
        const txInfo = await getTransactionInfo(tx, chain, {
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
        const safeInfo = await getSafeInfo(chain, address, {
          infura: {
            projectId: process.env.INFURA_PROJECT_ID as string,
          },
        });

        const balances = await bloomServices.getBalance({
          dex: {
            chains: [chain === 'goerli' ? 'eth' : chain],
            addresses: [address],
          },
        });
        let processedVault: {
          address: string;
          chain: Chain | 'goerli';
          owners: string[];
          threshold: number;
          balance: { asset: string; amount: string }[];
        } = {
          address,
          chain,
          owners: safeInfo.owners,
          threshold: safeInfo.threshold,
          balance: [],
        };
        balances.forEach((balance) => {
          processedVault.balance?.push({
            asset: balance.asset,
            amount: balance.balance,
          });
        });
        setVault(processedVault);
        setTransaction(txInfo);
        setLoading(false);
      })();
    }, [tx, address, queryChain]);
    return loading ? (
      <LoadingScreen />
    ) : (
      <Component tx={transaction} vault={vault} {...props} />
    );
  };

  return PreFetch;
};

export default withPreCheckSignVault;
