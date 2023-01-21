import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import Card from "../surfaces/Card";
import Image from "next/image";
import Iconify from "../Iconify";
import { useRouter } from "next/router";

export interface PlugInCardProps {
  brand: string;
  name: string;
  width?: number;
  labels?: React.ReactNode;
  text: string;
  configureGoTo: string;
}

const PlugInCard = (props: PlugInCardProps): JSX.Element => {
  const router = useRouter();
  return (
    <Card
      sx={{
        width: props.width || 370,
      }}
    >
      <Stack direction="row" spacing={2} m={2} pt={2} alignItems="center">
        <Image
          src={`/plugins/brands/${props.brand}.svg`}
          width={82}
          height={82}
          alt=""
        />

        <Stack
          sx={{
            width: "100%",
          }}
        >
          <Stack
            direction="row"
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Typography variant="h4">{props.name}</Typography>
            <Stack>
              <Iconify icon="tabler:external-link" />
            </Stack>
          </Stack>
          <Stack py={1}>{props.labels}</Stack>
        </Stack>
      </Stack>

      <Stack mb={1} px={2} direction="column" justifyContent="end" width="100%">
        <Typography variant="body1" pl={1} py={1}>
          {props.text}{" "}
        </Typography>
        <Stack direction="row" justifyContent="flex-end" pt={2}>
          <Box pb={2}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => router.push(props.configureGoTo)}
              startIcon={<Iconify icon="uiw:setting-o" />}
            >
              Configure
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
};

export default PlugInCard;
