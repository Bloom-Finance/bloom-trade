import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../../components/loadingScreen';
import { authService } from '../../../services/auth.services';
import { userServices } from '../../../services/users.services';
import { UserStore } from '../../../store/user.store';

const withPreCheckTransak = <P extends object>(
  Component: React.ComponentType<P>,
  params?: {
    redirectUrl?: string;
    shouldRedirect?: boolean;
  }
) => {
  const PreFetch = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
      (async () => {
        const session = await authService.getUserSession();
        if (!session) {
          router.push('/');
          return;
        }
        const user = await userServices.getUserById(session.userId);
        if (user.transakApiKey) {
          UserStore.update((s) => {
            s.transakApiKey = user.transakApiKey;
          });
          setApiKey(user.transakApiKey);
        }
        if (
          !user.transakApiKey &&
          params?.shouldRedirect &&
          params?.redirectUrl
        ) {
          router.push(params.redirectUrl);
        }
        setLoading(false);
      })();
    }, []);
    return loading ? (
      <LoadingScreen />
    ) : (
      <Component transakApiKey={apiKey} {...props} />
    );
  };

  return PreFetch;
};

export default withPreCheckTransak;
