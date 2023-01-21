import { Stack } from '@mui/system';
import React from 'react';
import Image from 'next/image';
import useResponsive from '../../hooks/useResponsive';
import { Button, Typography } from '@mui/material';
import InfoUser from './InfoUser';
import Item from './Item';
import { useRouter } from 'next/router';
import { UserStore } from '../../store/user.store';
interface Props {}

const Component = (props: Props): JSX.Element => {
  const mdUp = useResponsive('up', 'md');

  const router = useRouter();
  const { asPath } = router;

  return (
    <Stack
      direction='column'
      justifyContent='space-between'
      pb={4}
      sx={{
        height: '100vh',
        width: '280px',
        borderRight: '1px solid #E5E5E5',
      }}
    >
      <Stack>
        <Stack direction={'row'} pl={2} alignItems='center' height={80}>
          <Image
            src='/logo.svg'
            alt='logo'
            width={mdUp ? 101 : 101}
            height={mdUp ? 50 : 50}
          />
        </Stack>

        <Stack py={4}>
          <InfoUser />
        </Stack>

        <Stack>
          <Typography variant='overline' sx={{ px: 5, pb: 1 }}>
            Shortcuts
          </Typography>
        </Stack>
        <Stack onClick={() => router.push('/dashboard')}>
          <Item
            label={'Overview'}
            icon='ri:dashboard-3-line'
            selected={asPath === '/'}
          />
        </Stack>
        <Stack onClick={() => router.push('/payments/payout')}>
          <Item
            label={'PayOut'}
            icon='mdi:account-payment-outline'
            selected={asPath === '/'}
          />
        </Stack>
        <Stack>
          <Item label='Payment Request' icon='mdi:rocket-launch-outline' />
        </Stack>
        <Stack onClick={() => router.push('/payments/checkout')}>
          <Item
            label={'Checkouts'}
            icon='carbon:wireless-checkout'
            selected={asPath === '/'}
          />
        </Stack>

        <Stack onClick={() => router.push('/wallets')}>
          <Item
            label='My Wallets'
            icon='ion:wallet-outline'
            selected={asPath === '/wallets'}
          />
        </Stack>
        <Stack onClick={() => router.push('/withdraw')}>
          <Item
            selected={asPath === '/withdraw'}
            label='Withdraw'
            icon='uil:money-withdraw'
          />
        </Stack>
        <Stack onClick={() => router.push('/banking')}>
          <Item
            selected={asPath === '/banking'}
            label='Bank Account'
            icon='mdi:bank-outline'
          />
        </Stack>
        <Stack onClick={() => router.push('/integrations')}>
          <Item
            selected={asPath === '/integrations'}
            label='Plugins'
            icon='clarity:plugin-outline-badged'
          />
        </Stack>
      </Stack>
      <Stack px={2}>
        <Button variant='contained' sx={{ width: '100%' }} color='error'>
          Sign Out
        </Button>
      </Stack>
    </Stack>
  );
};

export default Component;
