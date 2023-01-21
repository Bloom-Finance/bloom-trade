import { Stack } from '@mui/material';
import React from 'react';
import useResponsive from '../../hooks/useResponsive';

interface Props {
  children: React.ReactNode;
  sx?: any;
}

const CardSurfaces = (props: Props): JSX.Element => {
  const mdUp = useResponsive('up', 'md');

  return (
    <Stack
      sx={{
        ...props.sx,
        boxShadow: mdUp
          ? '0px 0px 2px rgba(145, 158, 171, 0.24), 0px 16px 32px -4px rgba(145, 158, 171, 0.24)'
          : 'none',
        borderRadius: '16px',
      }}
    >
      {props.children}
    </Stack>
  );
};

export default CardSurfaces;
