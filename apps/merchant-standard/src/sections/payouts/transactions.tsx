import { Button, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import Label from '../../components/label';
import QuickTransfer from '../../components/quickTransfer';
import TableComponent, { TableHeadProps } from '../../components/table';
import { fCurrency } from '@bloom-trade/utilities';
import { Checkout, useBloom } from '@bloom-trade/ui';

export interface PayOutsRowsProps {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface PayOutTransactionsProps {
  headListTransactions: Array<TableHeadProps>;
  rowsListTransactions: Array<PayOutsRowsProps>;
}

const PayOutTransactions = (props: PayOutTransactionsProps): JSX.Element => {
  const [isOnPayoutProccess, setIsOnPayoutProccess] = React.useState(false);
  const { headListTransactions, rowsListTransactions } = props;
  const { Connect } = useBloom();
  const parseRow = (row: PayOutsRowsProps) => {
    return {
      id: row.id,
      components: [
        <Typography
          variant='body1'
          sx={{
            fontWeight: 700,
          }}
        >
          {row.date}
        </Typography>,
        <Typography variant='body1'>{row.from}</Typography>,
        <Typography variant='body1'>{row.to}</Typography>,
        <Typography variant='body1'>{fCurrency(row.amount)}</Typography>,
        <Label color={row.status === 'completed' ? 'success' : 'info'}>
          {row.status}
        </Label>,
      ],
    };
  };
  if (isOnPayoutProccess) {
    return (
      <Stack>
        <Button
          onClick={() => {
            setIsOnPayoutProccess(false);
          }}
        >
          dismiss
        </Button>
        <Checkout
          type='payout'
          walletConnectButton={<Connect />}
          onFinish={() => {
            setIsOnPayoutProccess(false);
          }}
        />
      </Stack>
    );
  }
  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid item xs={12} md={9}>
        <TableComponent
          head={headListTransactions}
          rows={rowsListTransactions.map(parseRow)}
          maxHeight={340}
          title='Last Payouts'
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Stack spacing={2}>
          <QuickTransfer
            onPay={() => {
              setIsOnPayoutProccess(true);
            }}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PayOutTransactions;
