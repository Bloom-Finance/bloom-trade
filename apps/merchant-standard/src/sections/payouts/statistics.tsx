import { Avatar, Container, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import SimpleBillboard from "../../components/billboards/simple";
import Image from "next/image";
// import CardSurfaces from "../../components/surfaces/Card";
import { CardSurfaces } from "@bloom-trade/react-sdk";
import Iconify from "../../components/Iconify";
import useResponsive from "../../hooks/useResponsive";
import { fCurrency } from "@bloom-trade/utilities";

export interface StatisticsProps {
  income: number;
  outcome: number;
  loading?: boolean;
}

const Statistics = (props: StatisticsProps): JSX.Element => {
  const { income, outcome, loading } = props;
  const mdUp = useResponsive("up", "md");

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item xs={12} md={6}>
        <SimpleBillboard
          title="Hi Leonardo!"
          description="All In One Place. Now, you can check all your assets and movements from one place. Connect your self custodial wallet with confidence. Always are you in control"
          color="success"
          width="100%"
          height="230px"
          media={
            <Stack width={155} height={111}>
              <Image src="/assets/analitics-green.svg" width={155} height={111} alt="analytics" />
            </Stack>
          }
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CardSurfaces
          sx={{
            height: "100%",
            py: mdUp ? 0 : 4,
          }}
        >
          <Stack direction={"column"} justifyContent="center" alignItems={"center"} height="100%" spacing={1}>
            <Avatar
              variant="circular"
              sx={{
                background: "rgba(81, 190, 136, 0.2)",
                mb: 4,
                width: "64px",
                height: "64px",
              }}
            >
              <Stack>
                <Iconify
                  icon="bi:box-arrow-in-down"
                  sx={{
                    color: "#51be88",
                    fontSize: "2rem",
                  }}
                />
              </Stack>
            </Avatar>
            <Typography variant="h3">{loading ? "Wait please" : fCurrency(income)}</Typography>
            <Typography variant="body1">Weekly Income</Typography>
          </Stack>
        </CardSurfaces>
      </Grid>

      <Grid item xs={12} md={3}>
        <CardSurfaces
          sx={{
            height: "100%",
            py: mdUp ? 0 : 4,
          }}
        >
          <Stack direction={"column"} justifyContent="center" alignItems={"center"} height="100%" spacing={1}>
            <Avatar
              variant="circular"
              sx={{
                background: "rgba(162, 0, 29, 0.2)",
                mb: 4,
                width: "64px",
                height: "64px",
              }}
            >
              <Stack>
                <Iconify
                  icon="bi:box-arrow-in-up"
                  sx={{
                    color: "#7A0916",
                    fontSize: "2rem",
                  }}
                />
              </Stack>
            </Avatar>
            <Typography variant="h3">{fCurrency(outcome)}</Typography>
            <Typography variant="body1">Weekly Income</Typography>
          </Stack>
        </CardSurfaces>
      </Grid>
    </Grid>
  );
};

export default Statistics;
