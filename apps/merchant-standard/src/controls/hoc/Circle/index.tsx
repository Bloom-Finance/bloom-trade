import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CircleBalances } from '../../../type';
import LoadingScreen from '../../../components/loadingScreen';
import { authService } from '../../../services/auth.services';
import { circleServices } from '../../../services/circle.services';
import { userServices } from '../../../services/users.services';
import { UserStore } from '../../../store/user.store';

const withPreCheckCircle = <P extends object>(
  Component: React.ComponentType<P>,
  params?: {
    redirectUrl?: string;
    shouldRedirect?: boolean;
  }
) => {
  const PreFetch = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [balance, setBalance] = useState<CircleBalances>();
    const router = useRouter();

    useEffect(() => {
      (async () => {
        const session = await authService.getUserSession();
        if (!session) {
          router.push('/');
          return;
        }
        const user = await userServices.getUserById(session.userId);
        if (user.circleApiKey) {
          UserStore.update((s) => {
            s.circleApiKey = user.circleApiKey;
          });
          setApiKey(user.circleApiKey);
        }
        if (
          !user.circleApiKey &&
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
      <Component circleApiKey={apiKey} {...props} />
    );
  };

  return PreFetch;
};

export default withPreCheckCircle;
