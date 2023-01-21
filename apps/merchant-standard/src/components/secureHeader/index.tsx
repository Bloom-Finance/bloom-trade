import React from "react";
import { Stack } from "@mui/system";
import Image from "next/image";
import useResponsive from "../../hooks/useResponsive";
import { Pink } from "../../theme";
import { Avatar, Drawer } from "@mui/material";
import Iconify from "../Iconify";
import Menu from "../appMenu";
import { UserStore } from "../../store/user.store";

interface Props {}

const Component = (props: Props): JSX.Element => {
  const user = UserStore.useState((s) => s);
  const mdUp = useResponsive("up", "md");
  const [showFloatingMenu, setShowFloatingMenu] = React.useState(false);

  if (!mdUp)
    return (
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems={"center"}
        sx={{
          height: "80px",
        }}
      >
        <Drawer anchor="right" open={showFloatingMenu} onClose={() => setShowFloatingMenu(false)}>
          <Menu />
        </Drawer>
        <Stack>
          <Image src="/favicon-32x32.png" alt="logo" width={32} height={32} />
        </Stack>

        <Iconify
          icon="mdi:menu"
          onClick={() => setShowFloatingMenu(true)}
          sx={{
            fontSize: "24px",
          }}
        />
      </Stack>
    );

  return (
    <Stack
      direction="row"
      width={"100%"}
      justifyContent="space-between"
      alignItems={"center"}
      sx={{
        borderBottom: "1px solid #E5E5E5",

        height: "80px",
      }}
    >
      <Stack pl={2}> L</Stack>
      <Stack px={2}>
        <Avatar
          sx={{
            bgcolor: Pink,
          }}
        >
          {user?.displayName?.charAt(0)}
        </Avatar>
      </Stack>
    </Stack>
  );
};

export default Component;
