import { Container, Stack } from "@mui/material";
import React from "react";
import useResponsive from "../../hooks/useResponsive";

import Header from "../../sections/@all/header";

interface Props {
  children: React.ReactNode;
}

const Component = (props: Props): JSX.Element => {
  const mdUp = useResponsive("up", "md");

  return mdUp ? (
    <Container>
      <Header />
      {props.children}
    </Container>
  ) : (
    <Stack>
      <Header />
      {props.children}
    </Stack>
  );
};

export default Component;
