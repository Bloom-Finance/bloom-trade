import { Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import Iconify from '../Iconify';
import Image from 'next/image';
import { height } from '@mui/system';
import useResponsive from '../../hooks/useResponsive';
import { formatWalletAddress } from '../../utils/wallets';
import Loader from '../loader';
import { Brands, CryptoWallet } from '../../type';
import { showAlert } from '../alert/handler';
interface Wallet extends CryptoWallet {
  balance: {
    amount: string;
    detail: {
      address?: string;
      balance?: string;
      chain?: string;
      provider: string;
      currency: string;
    }[];
  };
}
interface Props {
  brand: Brands;
  wallet: Wallet;
  loadingBalance: boolean;
  onRefreshWallet?: (wallet: Wallet) => Promise<void>;
  isRefreshingWallet?: { id: string } | undefined;
}

const Component = (props: Props): JSX.Element => {
  const mdUp = useResponsive('up', 'md');
  const [showingFront, setShowingFront] = useState(true);
  const getName = () => {
    switch (props.brand) {
      case 'mm':
        return 'MetaMask';
      case 'walletConnect':
        return 'WalletConnect';
      case 'circle':
        return 'Circle';
      default:
        return 'Not Defined';
    }
  };
  const getColor = () => {
    if (props.brand === 'mm')
      return {
        r: 246,
        g: 133,
        b: 26,
      };

    if (props.brand === 'circle')
      return {
        r: 10,
        g: 10,
        b: 183,
      };

    return {
      r: 0, //247,
      g: 0, //42,
      b: 0, //145,
    };
  };

  const Waves = () => {
    return (
      <svg
        width='103'
        height='373'
        viewBox='0 0 103 373'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M0.135528 373L17.2796 360.567C34.4237 348.133 68.7118 323.267 77.2839 298.4C85.8559 273.533 68.7118 248.667 54.4251 223.8C40.1384 198.933 28.709 174.067 17.2796 149.2C5.85022 124.333 -5.57916 99.4667 2.99287 74.6C11.5649 49.7333 40.1384 24.8667 54.4251 12.4333L68.7118 -1.90735e-06H103V12.4333C103 24.8667 103 49.7333 103 74.6C103 99.4667 103 124.333 103 149.2C103 174.067 103 198.933 103 223.8C103 248.667 103 273.533 103 298.4C103 323.267 103 348.133 103 360.567V373H0.135528Z'
          fill={`rgba(${getColor().r}, ${getColor().g}, ${getColor().b}, 1)`}
        />
      </svg>
    );
  };

  const LogoWallet = () => {
    return (
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='center'
        sx={{
          height: '55px',
          width: '55px',
          background: '#fff',
          borderRadius: '8px',
        }}
      >
        {props.brand !== 'notDefined' && (
          <Image
            src={`/wallets/${props.brand}.svg`}
            height={40}
            width={40}
            alt='wallet'
          />
        )}
      </Stack>
    );
  };
  const WalletData = (wallet: Wallet) => {
    return (
      <Stack>
        <Button
          disabled={
            props.loadingBalance || props.isRefreshingWallet !== undefined
          }
          variant='contained'
          onClick={() =>
            props.onRefreshWallet
              ? props.onRefreshWallet(wallet)
              : showAlert('No refresh function defined', 'error')
          }
        >
          Refresh
        </Button>
        <Typography
          variant='h4'
          pt={mdUp ? 2 : 0}
          sx={{ color: showingFront ? '#fff' : '#212B36' }}
        >
          {getName()}
        </Typography>
        <Typography
          variant='caption'
          sx={{
            color: showingFront ? '#fff' : '#637381',
          }}
        >
          {formatWalletAddress(props.wallet.address)}
        </Typography>
      </Stack>
    );
  };

  const WalletBalance = () => {
    return (
      <Stack spacing={1} pb={1} zIndex={8}>
        <Typography
          variant='caption'
          sx={{
            color: showingFront ? '#fff' : '#637381',
          }}
        >
          Your Balance
        </Typography>
        <Typography
          variant='h4'
          sx={{ color: showingFront ? '#fff' : '#212B36' }}
        >
          {props.loadingBalance ||
          (props.isRefreshingWallet !== undefined &&
            props.isRefreshingWallet.id === props.wallet.id) ||
          props.wallet.balance.amount === '-1' ? (
            <Loader />
          ) : (
            `$ ${props.wallet.balance.amount}`
          )}
        </Typography>
      </Stack>
    );
  };

  if (!mdUp)
    return (
      <Stack position='relative'>
        {showingFront && (
          <Stack
            position='absolute'
            left={111}
            top={-119}
            zIndex={6}
            sx={{
              transform: 'rotate(-90deg)',
              height: '325px',
            }}
          >
            <Waves />
          </Stack>
        )}
        <Stack
          zIndex={8}
          direction={'column'}
          justifyContent={'space-between'}
          sx={{
            width: '325px',
            height: '200px',
            background: showingFront
              ? `rgba(${getColor().r}, ${getColor().g}, ${getColor().b}, 0.8) `
              : '#fff',
            border: showingFront
              ? 'none'
              : `  1px solid rgba(${getColor().r}, ${getColor().g}, ${
                  getColor().b
                }, 0.24) `,
            borderRadius: '16px',
            p: 3,

            boxShadow: ` 4px 4px 4px rgba(${getColor().r}, ${getColor().g}, ${
              getColor().b
            }, 0.2)`,
          }}
        >
          <Stack
            direction='row'
            spacing={2}
            alignItems='center'
            justifyContent={'space-between'}
          >
            <Stack direction='row' spacing={2} alignItems='center'>
              <LogoWallet />
              {WalletData(props.wallet)}
            </Stack>
            {showingFront && (
              <Iconify
                onClick={() => setShowingFront(!showingFront)}
                icon='tabler:info-circle'
                color='#fff'
                sx={{
                  fontSize: '24px',
                }}
              />
            )}
            {!showingFront && (
              <Iconify
                onClick={() => setShowingFront(!showingFront)}
                icon='lucide:reply'
                color='#637381'
                sx={{
                  fontSize: '24px',
                }}
              />
            )}
          </Stack>

          <Stack>
            <WalletBalance />
          </Stack>
        </Stack>
      </Stack>
    );

  return (
    <Stack position='relative'>
      {showingFront && (
        <Stack position='absolute' left={130} zIndex={6}>
          <Waves />
        </Stack>
      )}
      <Stack
        direction='column'
        justifyContent={'space-between'}
        sx={{
          width: '231px',
          height: '373px',
          background: showingFront
            ? `rgba(${getColor().r}, ${getColor().g}, ${getColor().b}, 0.8) `
            : '#fff',
          border: showingFront
            ? 'none'
            : `  1px solid rgba(${getColor().r}, ${getColor().g}, ${
                getColor().b
              }, 0.24) `,
          borderRadius: '16px',
          p: 3,

          boxShadow: ' 4px 4px 4px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Stack spacing={1} zIndex={8}>
          <Stack
            direction='row'
            justifyContent={'space-between'}
            alignItems='center'
          >
            <LogoWallet />
            {showingFront && (
              <Iconify
                onClick={() => setShowingFront(!showingFront)}
                icon='tabler:info-circle'
                color='#fff'
                sx={{
                  fontSize: '24px',
                }}
              />
            )}
            {!showingFront && (
              <Iconify
                onClick={() => setShowingFront(!showingFront)}
                icon='lucide:reply'
                color='#637381'
                sx={{
                  fontSize: '24px',
                }}
              />
            )}
          </Stack>

          {WalletData(props.wallet)}
        </Stack>

        <WalletBalance />
      </Stack>
    </Stack>
  );
};

export default Component;
