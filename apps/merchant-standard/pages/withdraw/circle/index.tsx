import { Stack } from '@mui/material';
import type { NextPage } from 'next';
import SecuredPage from '../../../src/components/layout/securedPage';
import withPreCheckCircle from '../../../src/controls/hoc/Circle';
import CircleWithdrawComponent from '../../../src/sections/integrations/circle/withdraw';

const CircleWithdraw: NextPage = () => {
  return (
    <SecuredPage>
      <Stack>
        <CircleWithdrawComponent />
      </Stack>
    </SecuredPage>
  );
};

export default withPreCheckCircle(CircleWithdraw, {
  redirectUrl: '/integrations',
  shouldRedirect: true,
});
