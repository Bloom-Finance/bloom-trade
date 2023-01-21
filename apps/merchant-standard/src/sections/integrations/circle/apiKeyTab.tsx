import { Box, Button, Input, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import Loader from '../../../components/loader';
import CardSurfaces from '../../../components/surfaces/Card';
import { circleServices } from '../../../services/circle.services';
import { UserStore } from '../../../store/user.store';
import { manageCryptoCircleWallets } from '../../../utils/circle';
import { showAlert } from '../../../components/alert/handler';

interface Props {
  circleApiKey: string | null;
}

const CircleApiKeyTab = (props: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(
    props.circleApiKey === null ? '' : props.circleApiKey
  );
  const user = UserStore.useState((s) => s);
  const saveApiKey = async (apiKey: string) => {
    setLoading(true);
    const { isApiKeyCorrect } = await circleServices.checkCredentials(apiKey);
    if (!isApiKeyCorrect) {
      showAlert('Incorrect api key', 'error');
      setLoading(false);
      return;
    }
    await circleServices.saveApiKey(apiKey, user.id);
    await manageCryptoCircleWallets(user.id, apiKey);
    showAlert('Succesfully saved your api key', 'success');
    UserStore.update((s) => {
      s.circleApiKey = apiKey;
    });
    setLoading(false);
  };
  if (loading) return <Loader />;
  return (
    <>
      <CardSurfaces
        sx={{
          width: '70%',
        }}
      >
        <Stack p={2} spacing={2}>
          <Typography variant='subtitle1'>Circle Api Key</Typography>

          <Input
            onChange={async (e) => {
              await setApiKey(e.target.value);
            }}
            onBlur={async (e) => {
              console.log('you blurred');
            }}
            value={apiKey}
            type='text'
            placeholder='Enter your api key'
          />
          <Box pt={2}>
            <Button
              variant='contained'
              size='small'
              disabled={!apiKey}
              onClick={async () => {
                saveApiKey(apiKey);
              }}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </CardSurfaces>
    </>
  );
};

export default CircleApiKeyTab;
