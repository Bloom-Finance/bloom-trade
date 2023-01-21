import type { NextPage } from 'next';
import { useState } from 'react';
import { circleServices } from '../../../src/services/circle.services';
import withPreCheckCircle from '../../../src/controls/hoc/Circle/index';
import { UserStore } from '../../../src/store/user.store';
import SecuredPage from '../../../src/components/layout/securedPage';
import { Stack } from '@mui/system';
import Loader from '../../../src/components/loader';
import { manageCryptoCircleWallets } from '../../../src/utils/circle';
import { Button, Tab, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import InternalContainer from '../../../src/components/layout/internalContainer';
import withPreCheckTransak from '../../../src/controls/hoc/Transak';
import { userServices } from '../../../src/services/users.services';

interface Props {
  transakApiKey: string | null;
}

const Transak: NextPage<Props> = (props) => {
  const [tabSelected, setTabSelected] = useState('apiKey');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(
    props.transakApiKey === null ? '' : props.transakApiKey
  );
  const user = UserStore.useState((s) => s);
  const saveApiKey = async (apiKey: string) => {
    setLoading(true);
    await userServices.saveTransakApiKey(user.id, apiKey);
    setLoading(false);
  };
  return (
    <SecuredPage>
      <InternalContainer
        title='Transak setup'
        breadCum={[
          {
            title: 'Plugin list',
            goTo: '/integrations',
          },
          {
            title: 'Transak setup',
            goTo: '/integrations/transak',
          },
        ]}
      >
        <Stack>
          {!loading ? (
            <>
              <input
                placeholder='Enter your api key'
                type='text'
                value={apiKey}
                onChange={async (e) => {
                  await setApiKey(e.target.value);
                }}
              />
              <Button
                onClick={async () => {
                  await saveApiKey(apiKey);
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <Loader />
          )}
        </Stack>
      </InternalContainer>
    </SecuredPage>
  );
};

export default withPreCheckTransak(Transak);
