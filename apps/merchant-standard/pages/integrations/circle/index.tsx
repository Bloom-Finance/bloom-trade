import type { NextPage } from 'next';
import { useState } from 'react';
import withPreCheckCircle from '../../../src/controls/hoc/Circle/index';
import SecuredPage from '../../../src/components/layout/securedPage';
import { Stack } from '@mui/system';
import { Tab } from '@mui/material';
import InternalContainer from '../../../src/components/layout/internalContainer';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Iconify from '../../../src/components/Iconify';
import CircleBankList from '../../../src/sections/integrations/circle/bankList';
import CircleApiKeyTab from '../../../src/sections/integrations/circle/apiKeyTab';
import { UserStore } from '../../../src/store/user.store';
interface Props {
  circleApiKey: string | null;
}
const Circle: NextPage<Props> = (props) => {
  const [tabSelected, setTabSelected] = useState('apiKey');
  const user = UserStore.useState((s) => s);
  return (
    <SecuredPage>
      <InternalContainer
        title='Circle Setup'
        breadCum={[
          {
            title: 'Plugin list',
            goTo: '/integrations',
          },
          {
            title: 'Circle setup',
            goTo: '/integrations/circle',
          },
        ]}
      >
        <TabContext value={tabSelected}>
          <TabList
            indicatorColor='secondary'
            onChange={(e, v) => {
              setTabSelected(v);
            }}
          >
            <Tab
              icon={<Iconify icon='material-symbols:key-outline-rounded' />}
              iconPosition='start'
              label='Api Key'
              value={'apiKey'}
            />
            <Tab
              icon={<Iconify icon='mdi:bank-outline' />}
              iconPosition='start'
              label='Bank List'
              value={'bankList'}
            />
          </TabList>
          <TabPanel value={'apiKey'}>
            <Stack>
              <CircleApiKeyTab circleApiKey={props.circleApiKey} />
            </Stack>
          </TabPanel>
          {user.circleApiKey && (
            <TabPanel value={'bankList'}>
              <CircleBankList />
            </TabPanel>
          )}
        </TabContext>
      </InternalContainer>
    </SecuredPage>
  );
};

export default withPreCheckCircle(Circle);
