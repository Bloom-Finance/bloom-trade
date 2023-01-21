import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Iconify from "../Iconify";

import React from "react";
import { Pink } from "../../theme";

interface Props {
  selected?: boolean;
  icon: string;
  label: string;
}

const Component = (props: Props): JSX.Element => {
  return (
    <Stack
      direction="row"
      alignItems={"center"}
      spacing={2}
      px={3}
      py={1}
      mx={2}
      my={1}
      sx={{
        borderRadius: "5px",
        background: props.selected ? "rgba(248, 42, 145, 0.1);" : "transparent",
        cursor: "pointer",
      }}
    >
      <Stack>
        <Iconify
          icon={props.icon}
          sx={{
            fontSize: "24px",
            color: props.selected ? Pink : "#637381",
          }}
        />
      </Stack>
      <Stack>
        <Typography
          variant="body1"
          sx={{
            fontSize: "14px",
            color: props.selected ? Pink : "#637381",
          }}
        >
          {props.label}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Component;
