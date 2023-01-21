import { Web3Auth } from '@web3auth/modal';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../../components/loadingScreen';
import { authService } from '../../../services/auth.services';

const withPreCheckSignIn = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const PreFetch = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [web3AuthSession, setWeb3AuthSession] = useState<Web3Auth>();
    const [hasBloomSession, setHasBloomSession] = useState<boolean>(false);
    const [hasWeb3AuthSession, setHasWeb3AuthSession] =
      useState<boolean>(false);
    const router = useRouter();
    useEffect(() => {
      (async () => {
        const user = await authService.getUserSession();
        if (!user) {
          setHasBloomSession(false);
        } else {
          router.push('/dashboard');
        }
        const web3auth = new Web3Auth({
          clientId: process.env.CLIENT_ID_WEB3AUTH as string,
          chainConfig: {
            chainNamespace: 'eip155',
            chainId: '0x1',
          },
        });
        setWeb3AuthSession(web3auth);
        if (web3auth.cachedAdapter) {
          setHasWeb3AuthSession(true);
        } else {
          setHasWeb3AuthSession(false);
        }
        await web3auth.initModal();
        setLoading(false);
      })();
    }, []);
    return loading ? (
      <LoadingScreen />
    ) : (
      <Component
        hasBloomSession={hasBloomSession}
        web3Auth={web3AuthSession}
        hasWeb3AuthSession={hasWeb3AuthSession}
        {...props}
      />
    );
  };
  return PreFetch;
};

export default withPreCheckSignIn;
