import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useResponsive from '../../hooks/useResponsive';
import { Pink } from '../../../src/theme';
import { UserStore } from '../../store/user.store';
import { useRouter } from 'next/router';
import { userServices } from '../../services/users.services';
interface Props {}

const PersonalInfo = (props: Props): JSX.Element => {
  const mdUp = useResponsive('up', 'md');
  const router = useRouter();
  const user = UserStore.useState((s) => s);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [hasEmailInputErrors, setHasEmailInputErrors] =
    useState<boolean>(false);
  const PersonalInfoForm = () => {
    return (
      <Stack direction={'column'} justifyItems='center' alignItems={'center'}>
        <Typography variant='h3'>Personal Info</Typography>
        <Stack
          spacing={2}
          py={4}
          px={2}
          sx={{
            width: '100%',
          }}
        >
          <TextField
            key='displayName'
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
            id='outlined-basic'
            label='Display Name'
            variant='standard'
          />
          <TextField
            key='email'
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type='email'
            id='outlined-basic'
            label='Email'
            variant='standard'
            onBlur={() => {
              if (email.length > 0 && !email.includes('@')) {
                setHasEmailInputErrors(true);
              } else {
                setHasEmailInputErrors(false);
              }
            }}
            error={email.length > 0 && !email.includes('@')}
          />
        </Stack>

        <Stack direction='row' spacing={2}>
          <Button
            variant='outlined'
            onClick={() => {
              router.push('/onboarding/wallet');
            }}
          >
            Skip
          </Button>
          <Button
            variant='contained'
            onClick={async () => {
              UserStore.update((s) => {
                s.displayName = displayName;
                s.email = email;
              });
              const obj = {};
              if (displayName.length > 0) {
                Object.assign(obj, { displayName });
              }
              if (email.length > 0) {
                Object.assign(obj, { email });
              }
              await userServices.updateUser(user.id, {
                ...obj,
              });
              router.push('/onboarding/wallet');
            }}
            disabled={
              (displayName.length === 0 && email.length === 0) ||
              hasEmailInputErrors
            }
          >
            Next
          </Button>
        </Stack>
      </Stack>
    );
  };
  return (
    <Stack
      sx={{ height: '700px' }}
      direction='row'
      px={mdUp ? 0 : 2}
      alignItems={'center'}
      justifyItems='center'
    >
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography variant='h1'>Welcome</Typography>
          <Typography variant='h1' sx={{ color: Pink }}>
            {displayName || ''}
          </Typography>
          <Typography variant='body1' width={mdUp ? '85%' : '100%'} py={3}>
            The information requested here is not mandatory, you are not
            enforced to complete. We use this information to communicate with
            you in a proper manner. If you don't want to provide us, just click
            in Skip button and go directly to the app
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          {PersonalInfoForm()}
        </Grid>
      </Grid>
    </Stack>
  );
};

export default PersonalInfo;
