import { createTheme } from '@mui/material/styles';
import componentsOverride from './overrides';

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}
/*



 export function responsiveFontSizes({
  sm,
  md,
  lg,
}: {
  sm: number;
  md: number;
  lg: number;
}) {
  return {
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg),
    },
  };
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#EE9975",
      contrastText: "#fff",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: "160%",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          padding: "12px 36px",
          borderRadius: "8px",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 395,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "Nunito, sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 400,
      lineHeight: "120%",
      fontSize: pxToRem(60),
      letterSpacing: 2,
      ...responsiveFontSizes({ sm: 48, md: 60, lg: 60 }),
    },
    h2: {
      fontWeight: 400,
      lineHeight: "140%",
      fontSize: pxToRem(48),
      letterSpacing: 2,
      ...responsiveFontSizes({ sm: 42, md: 48, lg: 48 }),
    },
    h3: {
      fontWeight: 400,
      lineHeight: "140%",
      fontSize: "42px",
      letterSpacing: 2,
      ...responsiveFontSizes({ sm: 38, md: 42, lg: 42 }),
    },
    h4: {
      fontWeight: 400,
      lineHeight: 80 / 64,
      fontSize: pxToRem(36),
      letterSpacing: 2,
      ...responsiveFontSizes({ sm: 34, md: 38, lg: 4382 }),
    },
    h5: {
      fontWeight: 400,
      lineHeight: 80 / 64,
      fontSize: pxToRem(30),
      letterSpacing: 2,
      ...responsiveFontSizes({ sm: 30, md: 34, lg: 34 }),
    },
    h6: {
      fontWeight: 400,
      lineHeight: 80 / 64,
      fontSize: "24px",
      letterSpacing: 2,
      ...responsiveFontSizes({ sm: 24, md: 30, lg: 30 }),
    },
    subtitle1: {
      fontWeight: 400,
      lineHeight: 80 / 64,
      fontSize: pxToRem(20),
      letterSpacing: 2,
      // ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
    },
    subtitle2: {
      fontWeight: 400,
      lineHeight: 80 / 64,
      fontSize: pxToRem(18),
      letterSpacing: 2,
      // ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
    },
    body1: {
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "28px",
    },
    caption: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "145%",
    },
  },
});

export default theme; */
export const Pink = '#F82A91';
export const GraySmoth = '#637381';
export const Gray = '#E5E5E5';
const fontSize = 14; // px
// Tell Material-UI what's the font-size on the html element.
// 16px is the default font-size used by browsers.
const htmlFontSize = 16;
const coef = fontSize / 14;

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      light: '#F82A91',
    },
    secondary: {
      main: '#EE9975',
      contrastText: '#fff',
    },
  },
});

export type ColorSchema =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

const { breakpoints, typography } = defaultTheme;

const theme = {
  ...defaultTheme,
  components: {
    ...componentsOverride(defaultTheme),
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(16),
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingBottom: '15px',
          paddingTop: '15px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(16),
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(16),

          [breakpoints.down('sm')]: {
            fontSize: pxToRem(14),
          },
          mt: 2,
          color: '#373737',
          lineHeight: '160%',
          fontWeight: 250,
          textDecoration: 'none',
        },
      },
    },
  },
  typography: {
    pxToRem: (size: number) => `${(size / htmlFontSize) * coef}rem`,
    color: '#212B36',
    h1: {
      fontSize: pxToRem(64),
      lineHeight: '120%',
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(40),
      },
    },
    h2: {
      fontSize: pxToRem(48),
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(28),
      },
    },
    h3: {
      fontSize: pxToRem(40),
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(26),
      },
    },
    h4: {
      fontSize: pxToRem(32),
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(26),
      },
    },
    h5: {
      fontSize: pxToRem(18),
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(16),
      },
      lineHeght: '30px',
      fontWeight: 700,
    },
    h6: {
      fontSize: pxToRem(20),
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(18),
      },
      lineHeght: '30px',
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 400,
      lineHeight: 80 / 64,
      fontSize: pxToRem(24),
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(18),
      },
      // letterSpacing: 2,
      // ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
    },
    subtitle2: {
      fontWeight: 400,
      lineHeight: 80 / 64,
      fontSize: pxToRem(18),
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(16),
      },
      // letterSpacing: 2,
    },
    body1: {
      fontSize: pxToRem(16),
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(14),
      },
      fontWeight: 400,
      lineHeight: '160%',

      color: '#373737',
    },
    overline: {
      fontSize: pxToRem(12),
      [breakpoints.down('sm')]: {
        fontSize: pxToRem(12),
      },
      fontWeight: 700,
      lineHeight: '18px%',
      textTransform: 'uppercase',
      letterSpacing: '1.1px',

      color: '#637381',
    },
    caption: {
      fontSize: pxToRem(14),
      lineHeight: '150%',
      fontWeight: 400,
    },
  },
};

export default theme;
