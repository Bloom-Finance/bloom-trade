import { Theme } from '@mui/material/styles';
import { pxToRem } from '../theme';

export default function Button(theme: Theme) {
  const { breakpoints } = theme;

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          [breakpoints.down('sm')]: {
            fontSize: pxToRem(12),
          },
          lineHeight: '160%',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '12px 36px',
          borderRadius: '8px',
          fontWeight: 800,
        },
        sizeLarge: {
          textTransform: 'uppercase',
        },
        sizeSmall: {
          height: '38px',
          texTransform: 'lowercase',
          fontSize: pxToRem(12),
          padding: '12px 24px',
        },
      },
    },
  };
}
