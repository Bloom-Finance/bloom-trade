import { Web3Auth } from "@web3auth/modal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingScreen from "../../../components/loadingScreen";
import { authService } from "../../../services/auth.services";
import { userServices } from "../../../services/users.services";
import { SessionUser } from "../../../type";

const withPreckWeb3Wallet = <P extends object>(Component: React.ComponentType<P>) => {
  const PreFetch = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SessionUser>();
    const [preFetchedData, setPreFetchedData] = useState<{
      found: boolean;
      wallet: string;
      user: SessionUser;
    }>();
    const router = useRouter();
    useEffect(() => {
      (async () => {
        const user = await authService.getUserSession();
        if (!user || !user.userId) {
          router.push("/");
          return;
        }
        setUser(user);
        const { found, wallet } = await userServices.searchWeb3WalletByUser(user.userId);
        setPreFetchedData({ found, wallet, user });
        setLoading(false);
      })();
    }, []);

    return loading ? <LoadingScreen /> : <Component preFetchedData={preFetchedData} {...props} />;
  };

  return PreFetch;
};

export default withPreckWeb3Wallet;
