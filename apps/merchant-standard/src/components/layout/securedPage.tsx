import { Stack } from '@mui/system';
import React from 'react';
import useResponsive from '../../hooks/useResponsive';
import Menu from '../appMenu';
import SecureHeader from '../secureHeader';
import WithPreckSession from '../../controls/hoc/Session';
import Alert from '../alert';

interface Props {
  children: React.ReactNode;
}

const Component = (props: Props): JSX.Element => {
  const mdUp = useResponsive('up', 'md');
  return (
    <Stack>
      <Stack
        direction='row'
        position={'absolute'}
        width='100%'
        justifyContent={'center'}
        top={10}
      >
        <Alert />
      </Stack>
      <Stack direction='row'>
        {mdUp && <Menu />}
        <Stack
          px={mdUp ? 0 : 2}
          sx={{
            width: mdUp ? '90%' : '100%',
          }}
        >
          <SecureHeader />

          <Stack
            pt={mdUp ? 8 : 2}
            px={mdUp ? 4 : 2}
            sx={{
              maxWidth: '1440px',
            }}
          >
            {props.children}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WithPreckSession(Component);
