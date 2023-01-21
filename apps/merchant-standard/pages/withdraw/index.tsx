import { Stack } from '@mui/system';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import SecuredPage from '../../src/components/layout/securedPage';
import { UserStore } from '../../src/store/user.store';

const Withdraw: NextPage = () => {
  const router = useRouter();
  const user = UserStore.useState((s) => s);
  return (
    <SecuredPage>
      <Stack>
        {user.circleApiKey && (
          <h1
            onClick={() => {
              router.push('/withdraw/circle');
            }}
          >
            Circle
          </h1>
        )}
        {user.transakApiKey && (
          <h1
            onClick={() => {
              router.push('/withdraw/transak');
            }}
          >
            Transak
          </h1>
        )}
      </Stack>
    </SecuredPage>
  );
};

export default Withdraw;
