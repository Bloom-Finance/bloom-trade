import React from "react";

import { Stack, Typography } from "@mui/material";
import _ from "lodash";
import { useRouter } from "next/router";

interface Props {
  list: Array<{
    title: string;
    goTo: string;
  }>;
}

const Component = (props: Props): JSX.Element => {
  const router = useRouter();

  if (props.list.length === 1) {
    return (
      <Typography
        variant="body1"
        onClick={() => router.push(`/${props.list[0].goTo}`)}
        sx={{
          color: "text.secondary",
          cursor: "pointer",
        }}
        fontWeight="bold"
        mb={3}
      >
        {props.list[0].title}
      </Typography>
    );
  }

  return (
    <Stack direction="row" spacing={2}>
      {_.slice(props.list, 0, props.list.length - 1).map((item, index) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            key={index}
            variant="body1"
            onClick={() => router.push(`/${item.goTo}`)}
            sx={{
              cursor: "pointer",
            }}
          >
            {item.title}
          </Typography>
          <Stack
            width={8}
            height={8}
            sx={{
              backgroundColor: "#D9D9D9",
              borderRadius: "50%",
            }}
          />
        </Stack>
      ))}
      <Typography
        variant="body1"
        onClick={() => router.push(`/${_.last(props.list)?.goTo}`)}
        sx={{
          color: "text.secondary",
          cursor: "pointer",
        }}
      >
        {_.last(props.list)?.title}
      </Typography>
    </Stack>
  );
};

export default Component;
