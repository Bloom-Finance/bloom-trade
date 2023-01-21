import type { NextPage } from 'next';
import { Button, Stack } from '@mui/material';
// @ts-ignore
import transakSDK from '@transak/transak-sdk';
import withPreCheckTransak from '../../../src/controls/hoc/Transak/index';
import { UserStore } from '../../../src/store/user.store';
import SecuredPage from '../../../src/components/layout/securedPage';
const WithdrawTransak: NextPage = () => {
  let transak: any;
  const apiKey = UserStore.useState((s) => s.transakApiKey);
  return (
    <SecuredPage>
      <Stack>
        <h1>Use transak</h1>
        <Button
          onClick={() => {
            transak = new transakSDK({
              apiKey: apiKey,
              environment:
                process.env.MODE === 'DEV' ? 'STAGING' : 'PRODUCTION',
              widgetHeight: '625px', // choose your desired height
              widgetWidth: '500px', // choose your desired width
              themeColor: '#FF0083',
              networks: 'ethereum,polygon,bsc,tron',
              cryptoCurrencyList: 'ETH,DAI,USDC,USDT,MATIC',
            });
            transak.init();
          }}
        >
          Withdraw
        </Button>
      </Stack>
    </SecuredPage>
  );
};

export default withPreCheckTransak(WithdrawTransak, {
  shouldRedirect: true,
  redirectUrl: '/dashboard',
});
