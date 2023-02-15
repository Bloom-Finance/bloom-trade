import React, { useEffect } from "react";
import type { NextPage } from "next";
import { Button, Stack, Typography } from "@mui/material";
import { useBloom } from "@bloom-trade/react-sdk";
import { useAccount } from "wagmi";

const SwapPage: NextPage = () => {
  const { Connect, requestTokenAccess, data, waitingForUserResponse, waitingForBlockchain, transfer } = useBloom();
  const { isConnected, address } = useAccount();

  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [receipt, setReceipt] = React.useState<any>(null);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  const swap = async () => {
    const receipt = await transfer(
      {
        token: "usdt",
      },
      {
        chain: "polygon",
        token: "dai",
        address: address as string,
      },
      "2"
    );

    console.log(receipt);
    setReceipt(receipt);
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Typography variant="body1">From Matic to USDT</Typography>

        {hasLoaded && <Connect label="Conectate fiera" />}

        {isConnected && (
          <Stack>
            {!data && !waitingForUserResponse && (
              <Button variant="contained" onClick={() => requestTokenAccess("usdt", "polygon", "1000", "swapper")}>
                Autorizar USDT
              </Button>
            )}

            {waitingForUserResponse && "Autorizame"}
            {data && waitingForBlockchain && "Esperando a que se confirme la transacción"}
            {data?.txHash && data.transactionReceipt && !receipt && (
              <Button variant="contained" onClick={swap}>
                Swap
              </Button>
            )}

            {receipt && <div>Tengo recibo. Fin de la joda</div>}
          </Stack>
        )}
      </Stack>
    </div>
  );
};

export default SwapPage;
