import { Alert, Stack } from '@mui/material';
import { AlertStore } from '../../store/alert.store';

interface Props {}

const BloomAlert = (props: Props): JSX.Element => {
  const alert = AlertStore.useState((s) => s);
  if (alert.message === '' || alert.type === null) return <></>;
  return (
    <div data-aos='fade-down' data-aos-duration='600'>
      <Alert
        onClose={() => {
          AlertStore.update((s) => {
            s.message = '';
            s.type = null;
            s.callback = null;
          });
          alert.callback?.();
        }}
        severity={alert.type}
      >
        {alert.message}
      </Alert>
    </div>
  );
};

export default BloomAlert;
