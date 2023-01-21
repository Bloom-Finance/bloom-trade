import { Container, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../hooks/useResponsive";

export type ColorOptions = "success" | "error" | "warning" | "info";
export interface SimpleBillboardProps {
  title: string;
  description: string;
  color: ColorOptions;
  media?: React.ReactNode;
  width?: string;
  height?: string;
}

const SimpleBillboard = (props: SimpleBillboardProps): JSX.Element => {
  const { title, description, color, media, height, width } = props;
  const mdUp = useResponsive("up", "md");

  const getColorText = () => {
    switch (color) {
      case "success":
        return "#155535";
      case "error":
        return "rgba(255, 0, 0, 1)";
      case "warning":
        return "rgba(255, 255, 0, 1)";
      case "info":
        return "rgba(0, 0, 255, 1)";
      default:
        return "rgba(53, 205, 129, 1)";
    }
  };
  return (
    <Stack
      direction="row"
      alignItems={"center"}
      spacing={1}
      p={2}
      py={mdUp ? 0 : 4}
      sx={{
        maxWidth: "613px",
        background: "rgba(53, 205, 129, 0.2)",
        borderRadius: "12px",
        height: height && mdUp ? height : "auto",
        width: width && mdUp ? width : "auto",
      }}
    >
      <Grid container rowSpacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={mdUp ? 1 : 2}>
            <Typography
              align={mdUp ? "left" : "center"}
              sx={{
                color: getColorText(),
              }}
              variant="h5"
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              align={mdUp ? "left" : "center"}
              sx={{
                color: getColorText(),
              }}
            >
              {description}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems="center"
            sx={{
              height: "100%",
            }}
          >
            <Stack width={155} height={111}>
              {media}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default SimpleBillboard;

/*
 <Stack
      direction="row"
      alignItems={"center"}
      spacing={1}
      sx={{
        maxWidth: "613px",
        background: "rgba(53, 205, 129, 0.2)",
        borderRadius: "12px",
        height: height ? height : "auto",
        width: width ? width : "auto",
      }}
    >
      <Container>
        <Stack direction="row" spacing={2}>
          <Stack spacing={1}>
            <Typography
              sx={{
                color: getColorText(),
              }}
              variant="h5"
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: getColorText(),
              }}
            >
              {description}
            </Typography>
          </Stack>
          <Stack>{media}</Stack>
        </Stack>
      </Container>
    </Stack>
*/
