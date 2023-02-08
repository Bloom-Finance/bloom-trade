import { Asset, Chain } from "@bloom-trade/types";
import { fCurrency, getTokenIconBySymbol } from "@bloom-trade/utilities";
import { Card, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React, { FC } from "react";
import CardsList from "../../../components/cardsList";
import Label from "../../../components/label";
import Scrollbar from "../../../components/Scrollbar";

type BalanceDetail = {
  token: string;
  chain: Chain;
  balance: string;
};
export interface BalancesPerTokenProps {
  balances: BalanceDetail[];
}

export const BalancesPerToken: FC<BalancesPerTokenProps> = (props) => {
  const BalanceCard = (balance: BalanceDetail) => {
    return (
      <Stack px={1}>
        <Card
          sx={{
            p: 2,
            px: 4,
            width: 280,
          }}
        >
          <Stack direction="row" spacing={2}>
            <img src={getTokenIconBySymbol(balance.token as Asset)} width={82} height={82} alt={balance.token} />
            <Stack>
              <Stack direction="row" justifyContent={"space-between"} alignItems="center" spacing={2}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {balance.token.toUpperCase()}
                </Typography>
                <Label color="success">ERC20</Label>
              </Stack>
              <Stack pt={2}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Current Balance
                </Typography>
                <Typography variant="body2">{fCurrency(balance.balance)}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    );
  };

  return (
    <Scrollbar
      sx={{
        py: 4,
      }}
    >
      <Stack direction="row" spacing={2} pt={3}>
        {props.balances.map((balance) => (
          <BalanceCard key={balance.token} {...balance} />
        ))}
      </Stack>
    </Scrollbar>
  );
};
