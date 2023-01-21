import type { NextPage } from 'next';
import { Grid, Stack, Typography } from '@mui/material';
import { Web3Auth } from '@web3auth/modal';
import withPreCheckSignIn from '../../controls/hoc/SignIn';
import router from 'next/router';
import ButtonPlayVideo from '../../../src/components/buttonPlayVideo';
import useResponsive from '../../hooks/useResponsive';
import Image from 'next/image';
import { UserStore } from '../../store/user.store';
import { Pink } from '../../theme';
import useSignIn from '../../hooks/useSignIn';
import Button from '../../components/overrides/Button';
interface Props {
  hasBloomSession: boolean;
  web3Auth: Web3Auth;
  hasWeb3AuthSession: boolean;
}
const Index: NextPage<Props> = (props) => {
  const { signIn, loading, waitingForSignIn } = useSignIn(props.web3Auth);
  const mdUp = useResponsive('up', 'md');
  return (
    <Stack
      direction='row'
      justifyContent='center'
      alignItems='center'
      sx={{
        height: '600px',
      }}
    >
      <Grid container>
        <Grid item xs={12} md={6}>
          <Stack width={mdUp ? '80%' : '100%'} px={mdUp ? 0 : 2}>
            <Typography variant='h1'>The first</Typography>
            <Typography
              variant='h1'
              sx={{
                color: Pink,
              }}
            >
              noncustodial
            </Typography>
            <Typography variant='h1'>crypto hub</Typography>
            <Typography variant='body1' py={4}>
              Sell goods and services and get payment with the currency of your
              choice directly in your wallet or bank account without financial
              intermediaries
            </Typography>

            <Grid container spacing={1} gap={0}>
              <Grid item xs={12} md={6}>
                <Button
                  label={
                    waitingForSignIn
                      ? 'Waiting to sign in transaction'
                      : 'Get started'
                  }
                  variant='contained'
                  loading={loading}
                  onClick={async () => {
                    if (!props.hasWeb3AuthSession) {
                      await props.web3Auth.connect();
                    }
                    if (!signIn) {
                      return;
                    }
                    const { user, wasUserRegistered } = await signIn();
                    UserStore.update((s) => {
                      s.id = user.id;
                      s.iat = user.iat;
                      s.email = user.email;
                      s.displayName = user.displayName;
                    });
                    if (wasUserRegistered) {
                      router.push('/dashboard');
                    } else {
                      router.push('/onboarding');
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ButtonPlayVideo
                  sx={{
                    mt: 2,
                  }}
                  darkMode={false}
                  secondsToReproduce={47}
                  label='Bloom in action'
                />
              </Grid>
            </Grid>
          </Stack>
        </Grid>

        {mdUp && (
          <Grid item xs={12} md={6}>
            <Image
              src='/landing/checkout.svg'
              width={540}
              height={430}
              alt='checkout'
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default withPreCheckSignIn(Index);
