import { Stack, Typography } from '@mui/material';
import React from 'react';
import BreadCum from '../breadCum';

interface Props {
  children: React.ReactNode;
  title?: string;
  breadCum?: Array<{
    title: string;
    goTo: string;
  }>;
  actions?: React.ReactNode;
}

const InternalContainer = (props: Props): JSX.Element => {
  return (
    <Stack spacing={3} mb={3}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='h3' fontWeight='bold'>
          {props.title}
        </Typography>
        {props.actions}
      </Stack>

      <Stack>{props.breadCum && <BreadCum list={props.breadCum} />}</Stack>
      {props.children}
    </Stack>
  );
};

export default InternalContainer;
