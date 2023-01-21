import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import { User } from "../../type";
import { UserStore } from "../../store/user.store";
import { Pink } from "../../theme";

interface Props {}

const Component = (props: Props): JSX.Element => {
  const user: User = UserStore.useState((s) => s);
  return (
    <Stack
      direction="row"
      spacing={2}
      py={2}
      px={3}
      mx={2}
      sx={{
        background: "#F4F6F8",
        borderRadius: "12px",
      }}
    >
      <Avatar
        sx={{
          bgcolor: Pink,
        }}
      >
        {user.displayName?.charAt(0)}
      </Avatar>
      <Stack>
        <Typography
          variant="body1"
          sx={{
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {user.displayName}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#637381",
            fontSize: "14px",
          }}
        >
          0 Notifications
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Component;
