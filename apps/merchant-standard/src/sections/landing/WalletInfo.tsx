import {
  Button,
  Grid,
  Input,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import useResponsive from '../../hooks/useResponsive';
import { Pink } from '../../../src/theme';
import withPreckWeb3Wallet from '../../controls/hoc/Wallet';
import { isWeb3WalletByAddress } from '../../utils/wallets';
import { cryptoWalletServices } from '../../services/cryptoWallet.services';
import { useRouter } from 'next/router';
import { SessionUser } from '../../type';
interface Props {
  preFetchedData: { wallet: string; found: boolean; user: SessionUser };
}

const WalletInformation = (props: Props): JSX.Element => {
  const mdUp = useResponsive('up', 'md');
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = React.useState<{
    address: string;
    chain: string;
    currency: string;
  }>({
    address: props.preFetchedData.wallet,
    chain: 'ETH',
    currency: 'USDT',
  });
  const router = useRouter();
  const Empty = () => {
    return (
      <Stack
        direction={'column'}
        justifyItems='center'
        alignItems={'center'}
        spacing={3}
      >
        <Typography variant='body1' align='center'>
          To provide information about your wallet, please connect using the
          connection button
        </Typography>

        <Button fullWidth variant='contained'>
          Connect your wallet
        </Button>

        <Typography variant='body1' align='center'>
          Or, you can do it latter if you want
        </Typography>

        <Button
          variant='outlined'
          fullWidth
          onClick={() => router.push('/dashboard')}
        >
          Skip
        </Button>
      </Stack>
    );
  };

  const WalletInfo = () => {
    return (
      <Stack direction={'column'} justifyItems='center' alignItems={'center'}>
        <Typography variant='h3'>Wallet Info</Typography>
        <Stack
          spacing={2}
          py={4}
          px={2}
          sx={{
            width: '100%',
          }}
        >
          <TextField
            onChange={(e) => {
              setWalletData({
                ...walletData,
                address: e.target.value,
              });
            }}
            value={walletData?.address}
            id='outlined-basic'
            label='Wallet Address'
            variant='standard'
          />

          <Select
            value={walletData.chain}
            onChange={(e) => {
              setWalletData({
                ...walletData,
                chain: e.target.value,
              });
            }}
            id='outlined-basic'
            label='Currency'
            variant='standard'
          >
            <MenuItem value='ETH'>Ethereum</MenuItem>
            <MenuItem value='PLG'>Polygon</MenuItem>
          </Select>
          <Select
            value={walletData.currency}
            id='currency'
            label='Currency'
            onChange={(e) => {
              setWalletData({
                ...walletData,
                currency: e.target.value,
              });
            }}
            variant='standard'
          >
            <MenuItem value='USDC'>USDC</MenuItem>
            <MenuItem value='USDT'>USDT</MenuItem>
            <MenuItem value='DAI'>DAI</MenuItem>
          </Select>
        </Stack>

        <Stack direction='row' spacing={2}>
          <Button variant='outlined' onClick={() => router.push('/dashboard')}>
            Skip
          </Button>
          <Button
            variant='contained'
            disabled={!isWeb3WalletByAddress(walletData.address)}
            onClick={async () => {
              setLoading(true);
              try {
                await cryptoWalletServices.save({
                  address: walletData.address,
                  chains: [walletData.chain],
                  isPrincipal: true,
                  brand: 'notDefined',
                  owner: props.preFetchedData.user.userId,
                  currency: walletData.currency,
                });
                setLoading(false);
                router.push('/dashboard');
              } catch (error) {
                throw new Error('Error saving wallet');
              }
            }}
          >
            {loading ? 'Loading...' : 'Next'}
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
          <Typography variant='h1'>Declare your</Typography>
          <Typography variant='h1' sx={{ color: Pink }}>
            Principal Wallet
          </Typography>
          <Typography variant='body1' width={mdUp ? '85%' : '100%'} py={3}>
            To starting collect payments we need that you define where you want
            to receive payments. We need information about your wallet address,
            chain and coin of your preference
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack pt={mdUp ? 0 : 4}>{WalletInfo()}</Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default withPreckWeb3Wallet(WalletInformation);
