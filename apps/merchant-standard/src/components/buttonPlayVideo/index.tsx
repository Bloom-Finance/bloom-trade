import { Stack } from "@mui/system";
import React from "react";
import Image from "next/image";
import { Typography } from "@mui/material";

export interface ButtonPlayVideoProps {
  darkMode: boolean;
  secondsToReproduce: number;
  label: string;
  sx?: any;
}

const ButtonPlayVideo = (props: ButtonPlayVideoProps): JSX.Element => {
  return (
    <Stack
      direction={"row"}
      spacing={2}
      alignItems="center"
      sx={{
        ...props.sx,
      }}
    >
      <Stack>
        <Image src="/all/icon_play.svg" width={36} height={36} alt="Play" />
      </Stack>
      <Stack>
        <Typography
          sx={{
            textTransform: "uppercase",
            lineHeight: "160%",
            fontSize: "14px",
            letterSpacing: "0.1em",
            color: props.darkMode ? "#fff" : "#000",
          }}
        >
          {props.label}
        </Typography>

        <Typography
          sx={{
            lineHeight: "160%",
            fontSize: "16px",
            fontWeight: 400,
            color: "#747373;",
          }}
        >
          {`${props.secondsToReproduce} seconds`}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ButtonPlayVideo;
