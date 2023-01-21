import { Stack, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import useResponsive from "../../hooks/useResponsive";

interface Props {}

const Component = (props: Props): JSX.Element => {
  const mdUp = useResponsive("up", "md");

  return (
    <div data-aos="zoom-in" data-aos-easing="linear" data-aos-duration="700">
      <Stack
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          height: mdUp ? "408px" : "204px",
        }}
      >
        <Stack width={"100%"} spacing={2}>
          <Typography variant="h3" align="center">
            Wallet Supported
          </Typography>
          <Typography variant="body1" align="center">
            we support them all
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          pt={4}
          sx={{
            width: mdUp ? "100%" : "355px",
            overflowX: "auto",
          }}
        >
          <Stack>
            <Image
              src="/wallets/binance.svg"
              width={64}
              height={64}
              alt="Wallet"
            />
          </Stack>
          <Stack>
            <Image
              src="/wallets/bitpay.svg"
              width={64}
              height={64}
              alt="Wallet"
            />
          </Stack>
          <Stack>
            <Image
              src="/wallets/blockchain.svg"
              width={64}
              height={64}
              alt="Wallet"
            />
          </Stack>
          <Stack>
            <Image src="/wallets/brd.svg" width={64} height={64} alt="Wallet" />
          </Stack>

          <Stack>
            <Image
              src="/wallets/coinbase.svg"
              width={64}
              height={64}
              alt="Wallet"
            />
          </Stack>
          <Stack>
            <Image
              src="/wallets/exodus.svg"
              width={64}
              height={64}
              alt="Wallet"
            />
          </Stack>
          <Stack>
            <Image
              src="/wallets/gemini.svg"
              width={64}
              height={64}
              alt="Wallet"
            />
          </Stack>
          <Stack>
            <Image
              src="/wallets/kraken.svg"
              width={64}
              height={64}
              alt="Wallet"
            />
          </Stack>
          <Stack>
            <Image
              src="/wallets/ledger.svg"
              width={64}
              height={64}
              alt="Wallet"
            />
          </Stack>
          <Stack>
            <Image src="/wallets/mm.svg" width={64} height={64} alt="Wallet" />
          </Stack>
          <Stack>
            <Image
              src="/wallets/trust.svg"
              width={64}
              height={64}
              alt="Wallet"
            />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default Component;
