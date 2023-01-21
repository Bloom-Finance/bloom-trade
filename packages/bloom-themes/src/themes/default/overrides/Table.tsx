import { Theme } from '@mui/material/styles';

export default function Table(theme: Theme) {
  return {
    MuiTableCell: {
      styleOverrides: {
        head: {
          background: '#E8EAF1',
          color: '#637381',
        },
        root: {
          borderBottom: 'none',
          paddingLeft: '40px',
          paddingRight: '40px',
        },
      },
    },
  };
}
