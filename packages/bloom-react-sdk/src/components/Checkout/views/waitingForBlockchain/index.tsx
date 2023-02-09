/* eslint-disable react/jsx-key */
import { Chain, Testnet } from '@bloom-trade/types'
import { getBlockchainExplorerName, getTxDetailsBlockchainExplorer } from '@bloom-trade/utilities'
import { Grid, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import useResponsive from '../../../../hooks/useResponsive'
export interface Props {
  txHash: string
  chain: Chain | Testnet
}
const WaitingForBlockchain = (props: Props): JSX.Element => {
  const mdUp = useResponsive('up', 'md')

  return (
    <Stack
      spacing={3}
      p={mdUp ? 4 : 0}
      sx={{
        boxShadow: mdUp
          ? '0px 0px 2px rgba(145, 158, 171, 0.24), 0px 16px 32px -4px rgba(145, 158, 171, 0.24);'
          : 'none',
        borderRadius: mdUp ? '8px' : 'none',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <Stack direction={'row'} justifyContent='center'>
            <ImageAvatar />
          </Stack>
        </Grid>
        <Grid item xs={12} md={10}>
          <Stack direction={'column'} justifyContent='center'>
            <Typography variant='body1' sx={{ fontWeight: 600 }} align={mdUp ? 'left' : 'center'} gutterBottom>
              Your transaction is being processed in blockchain
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 600 }} align={mdUp ? 'left' : 'center'} gutterBottom>
              View your transaction in{' '}
              <Link target='_blank' href={getTxDetailsBlockchainExplorer(props.txHash, props.chain)}>
                {getBlockchainExplorerName(props.chain)}
              </Link>{' '}
              explorer
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default WaitingForBlockchain

const ImageAvatar = () => {
  return (
    <svg width='150' height='122' viewBox='0 0 150 122' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M67.525 120.069C97.8445 120.069 122.455 95.6898 122.455 65.6267C122.455 35.5635 97.8445 11.1846 67.525 11.1846C37.2055 11.1846 12.5947 35.5635 12.5947 65.6267C12.5947 95.6898 37.2055 120.069 67.525 120.069Z'
        fill='#F1F3FA'
        stroke='#D6DDE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M5.99729 59.0587C8.02705 59.0587 9.67623 57.543 9.67623 55.3956C9.67623 53.2482 8.02705 51.7324 5.99729 51.7324C3.96754 51.7324 2.31836 53.2482 2.31836 55.3956C2.31836 57.543 4.0944 59.0587 5.99729 59.0587Z'
        fill='#F1F3FA'
      />
      <path
        d='M2.44574 47.4374C3.8412 47.4374 4.85608 46.3006 4.85608 44.9111C4.85608 43.6479 3.71434 42.3848 2.44574 42.3848C1.17714 42.3848 0.0354012 43.5216 0.0354012 44.9111C-0.218319 46.4269 0.92342 47.4374 2.44574 47.4374Z'
        fill='#F1F3FA'
      />
      <path
        d='M132.985 68.153C135.522 68.153 137.679 66.132 137.679 63.4793C137.679 60.8267 135.649 58.8057 132.985 58.8057C130.448 58.8057 128.291 60.8267 128.291 63.4793C128.418 66.132 130.448 68.153 132.985 68.153Z'
        fill='#F1F3FA'
      />
      <path
        d='M117.508 104.405H18.3032C14.2437 104.405 10.9453 101.121 10.9453 97.0789V36.8263C10.9453 32.7842 14.2437 29.5 18.3032 29.5H117.381C121.44 29.5 124.739 32.7842 124.739 36.8263V97.0789C124.865 101.121 121.567 104.405 117.508 104.405Z'
        fill='white'
        stroke='#D6DDE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M18.3027 49.0785V39.2259C18.3027 37.7101 19.4445 36.5732 20.9668 36.5732H114.97C116.492 36.5732 117.634 37.7101 117.634 39.2259V94.5522C117.634 96.068 116.492 97.2048 114.97 97.2048H20.9668C19.4445 97.2048 18.3027 96.068 18.3027 94.5522V70.5522'
        fill='white'
      />
      <path
        d='M18.3027 49.0785V39.2259C18.3027 37.7101 19.4445 36.5732 20.9668 36.5732H114.97C116.492 36.5732 117.634 37.7101 117.634 39.2259V94.5522C117.634 96.068 116.492 97.2048 114.97 97.2048H20.9668C19.4445 97.2048 18.3027 96.068 18.3027 94.5522V70.5522'
        stroke='#D6DDE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path d='M18.3027 64.8683V57.1631' stroke='#D6DDE8' strokeWidth='2' strokeMiterlimit='10' />
      <path
        d='M112.577 27.2389C112.688 27.3502 112.8 27.3502 112.912 27.3502C113.582 27.5727 114.365 27.1276 114.588 26.3488C117.605 19.005 123.528 9.102 131.909 5.20757L134.256 8.99073C134.591 9.54708 135.373 9.65835 136.044 9.102C136.603 8.65692 136.826 7.76677 136.491 7.21042L134.144 3.42726C133.585 2.53711 132.58 2.31457 131.574 2.75965C121.181 6.87661 115.594 17.781 112.353 25.6811C112.018 26.3488 112.13 26.9051 112.577 27.2389Z'
        fill='#AAB2C5'
      />
      <path
        d='M91.1211 72.6365C91.9033 73.3041 92.3503 73.6379 92.4621 73.7492C92.4621 73.7492 92.4621 73.7492 94.0266 74.9732C96.5968 71.9689 102.408 70.5224 105.984 70.8562C105.872 70.8562 108.219 64.2913 108.554 63.735C110.565 60.0631 113.359 56.8363 115.929 53.6095L109.56 51.1615L113.247 46.5995L109.448 51.1615L106.431 46.377C104.084 49.3812 101.961 52.4968 99.2787 55.1672C97.1555 57.2813 94.5853 58.8391 92.0151 60.2856C93.3561 63.4012 93.3561 69.4097 91.1211 72.6365Z'
        fill='#D6DCE8'
        stroke='#AAB2C5'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinejoin='round'
      />
      <path
        d='M103.423 63.2041C103.983 62.3207 103.718 61.1525 102.831 60.5949C101.944 60.0372 100.77 60.3013 100.21 61.1847C99.6503 62.068 99.9155 63.2362 100.803 63.7939C101.69 64.3516 102.863 64.0875 103.423 63.2041Z'
        fill='#D6DCE8'
        stroke='#AAB2C5'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path d='M92.4619 73.7495L100.508 63.624' stroke='#AAB2C5' strokeWidth='2' strokeMiterlimit='10' />
      <path
        d='M147.107 1.31334C147.442 1.42461 147.554 1.53588 147.778 1.75841C151.13 4.98523 143.643 18.7826 132.356 33.6927C123.528 45.2647 117.047 52.9423 114.477 55.7241C113.806 56.3917 112.8 56.5029 111.906 56.0579C108.777 54.1663 108.219 53.6099 104.866 50.6057C104.196 49.938 104.084 48.8254 104.531 48.0465C106.431 44.8197 112.018 36.5857 120.623 24.9024C131.798 9.99235 143.196 -1.02332 147.107 1.31334Z'
        fill='white'
        stroke='#AAB2C5'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path d='M144.76 14.9992C142.972 14.7766 137.832 12.3287 135.262 7.87793L144.76 14.9992Z' fill='white' />
      <path
        d='M144.76 14.9992C142.972 14.7766 137.832 12.3287 135.262 7.87793'
        stroke='#AAB2C5'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M26.9297 86.2154C34.9219 83.3101 41.7723 77.1207 45.3244 69.4154C44.0558 73.0786 41.0111 83.9417 44.4363 86.0891C45.7049 86.9733 47.6078 86.5943 48.7496 85.5838C50.2719 84.3207 50.2719 84.3207 61.1818 63.0996C59.7864 65.7522 58.8984 67.5207 58.0103 70.4259C57.1223 73.3312 56.1074 77.1207 56.3612 80.1522C56.6149 84.5733 58.2641 86.2154 60.0401 86.7207C64.8608 88.1101 66.7637 81.9207 67.2711 78.5101C66.7637 79.8996 66.7637 80.7838 66.6368 82.2996C66.3831 88.6154 72.0918 88.7417 74.3753 86.7207C76.6587 84.5733 77.1662 82.9312 77.5468 81.5417C77.1662 82.9312 76.7856 83.8154 76.9125 85.2049C77.293 87.9838 81.3526 88.9943 83.5092 84.8259'
        stroke='#AAB2C5'
        strokeWidth='4'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M87.9492 79.3949V79.2686'
        stroke='#AAB2C5'
        strokeWidth='4'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
