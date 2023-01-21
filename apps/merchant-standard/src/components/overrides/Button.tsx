import { Button, Stack } from '@mui/material';
import Loader from '../loader';

interface Props {
  sx?: any;
  loading?: boolean;
  variant: 'text' | 'outlined' | 'contained' | undefined;
  onClick: any;
  label: string;
}

const BloomButton = (props: Props): JSX.Element => {
  return (
    <Button onClick={props.onClick} variant={props.variant} sx={props.sx}>
      {!props.loading ? props.label : <Loader />}
    </Button>
  );
};

export default BloomButton;
