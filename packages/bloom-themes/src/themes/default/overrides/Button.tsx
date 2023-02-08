import { Theme } from "@mui/material/styles";
import { pxToRem } from "../theme";

export default function Button(theme: Theme) {
  const { breakpoints } = theme;

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          [breakpoints.down("sm")]: {
            fontSize: pxToRem(12),
          },
          lineHeight: "160%",
          letterSpacing: "0.1em",
          padding: "12px 36px",
          borderRadius: "8px",
        },
        sizeLarge: {
          textTransform: "uppercase",
          fontWeight: 800,
        },
        sizeSmall: {
          height: "32px",
          texTransform: "lowercase",
          [breakpoints.down("sm")]: {
            fontSize: pxToRem(12),
          },
          fontSize: pxToRem(14),
          lineHeight: "120%",
          letterSpacing: "0em",
          padding: "12px 24px",
          fontWeight: 500,
        },
      },
    },
  };
}
