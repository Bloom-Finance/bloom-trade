import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useResponsive from "../../../hooks/useResponsive";
import theme from "../../../theme";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {}

const Component = (props: Props): JSX.Element => {
  const { breakpoints } = theme;

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const upMd = useResponsive("up", "md");
  const router = useRouter();

  return (
    <Stack
      direction="row"
      alignItems={"center"}
      justifyContent={"space-between"}
      p={upMd ? 0 : 2}
      sx={{
        height: upMd ? "96px" : "80px",
      }}
    >
      <Stack onClick={() => router.push("/")}>
        <Image
          src="/logo.svg"
          alt="logo"
          width={upMd ? 101 : 101}
          height={upMd ? 50 : 50}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <Typography variant="caption" sx={{ cursor: "pointer" }}>
          Terms and Conditions
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Component;
