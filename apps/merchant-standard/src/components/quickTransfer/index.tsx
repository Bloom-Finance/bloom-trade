import { Button, Stack, Typography } from '@mui/material';
import { Pink } from '../../theme';
import { fCurrency } from '@bloom-trade/utilities';

export interface QuickTransferProps {
  onPay: () => void;
}

const QuickTransfer = (props: QuickTransferProps): JSX.Element => {
  return (
    <Stack
      direction='column'
      justifyContent='space-between'
      spacing={2}
      p={3}
      sx={{
        width: '300px',
        height: '445px',
        borderRadius: '16px',
        backgroundColor: 'rgba(145, 158, 171, 0.12)',
      }}
    >
      <Stack direction={'row'} justifyContent='space-between' spacing={2}>
        <Typography variant='h6'>Quick Transfer</Typography>
        <Typography variant='h2' color={Pink}>
          +
        </Typography>
      </Stack>
      <Stack>
        <Typography
          variant='body1'
          align='center'
          sx={{
            fontWeight: 700,
            color: 'rgba(99, 115, 129, 1)',
          }}
        >
          Transfer to Alex
        </Typography>
        <Typography
          variant='body1'
          align='center'
          sx={{
            fontWeight: 700,
            color: 'rgba(99, 115, 129, 1)',
          }}
        >
          USDT (ERC20) OX...SDFA
        </Typography>

        <Typography pt={4} variant='h2' align='center'>
          {fCurrency(1500)}
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Stack direction={'row'} justifyContent='space-between'>
          <Typography
            variant='body1'
            sx={{ fontWeight: 700, color: 'rgba(99, 115, 129, 1)' }}
          >
            Your balance
          </Typography>
          <Typography variant='body1' sx={{ fontWeight: 700 }}>
            {fCurrency(3200)}
          </Typography>
        </Stack>
        <Button
          onClick={() => {
            props.onPay();
          }}
          variant='contained'
          sx={{ width: '100%' }}
        >
          Send
        </Button>
      </Stack>
    </Stack>
  );
};

export default QuickTransfer;
