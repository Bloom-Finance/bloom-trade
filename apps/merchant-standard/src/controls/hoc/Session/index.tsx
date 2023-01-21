import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../../components/loadingScreen';
import { authService } from '../../../services/auth.services';
import { transactionsServices } from '../../../services/transactions.services';
import { userServices } from '../../../services/users.services';
import { TransactionsStore } from '../../../store/transactions.store';
import { UserStore } from '../../../store/user.store';
import { showAlert } from '../../../components/alert/handler';
import { getLatestBlocksAndDatesByTx } from '@bloom-trade/utilities';

const withPreckUser = <P extends object>(Component: React.ComponentType<P>) => {
  const PreFetch = (props: any) => {
    const [loading, setLoading] = useState(true);
    const userStore = UserStore.useState((s) => s);
    const transactionsStore = TransactionsStore.useState((s) => s);
    const router = useRouter();
    useEffect(() => {
      (async () => {
        const session = await authService.getUserSession();
        if (!session) {
          router.push('/');
          return;
        }
        //Check user store
        if (!userStore || userStore.id === '') {
          const user = await userServices.getUserById(session.userId);
          UserStore.update((s) => {
            s.id = user.id;
            s.email = user.email;
            s.displayName = user.displayName;
            s.circleApiKey = user.circleApiKey;
            s.transakApiKey = user.transakApiKey;
          });
        }
        if (
          !transactionsStore.fetching &&
          transactionsStore.transactions.length === 0
        ) {
          const user = await userServices.getUserById(session.userId);
          TransactionsStore.update((s) => {
            s.fetching = true;
          });
          const { data, error } = await transactionsServices.getTransactions({
            circleApiKey: user.circleApiKey,
            from: 'beginning',
          });
          if (!data) {
            TransactionsStore.update((s) => {
              s.fetching = false;
              s.transactions = [];
            });
          } else {
            //Process data to get latest each individual last block per chain and provider
            const res = getLatestBlocksAndDatesByTx(data);
            TransactionsStore.update((s) => {
              s.transactions = data;
              s.fetching = false;
              s.catchedFetchingParams = res;
            });
          }
        }
        setLoading(false);
      })();
    }, []);
    return loading ? <LoadingScreen /> : <Component {...props} />;
  };
  return PreFetch;
};

export default withPreckUser;
