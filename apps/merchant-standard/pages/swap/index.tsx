import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { Button, Stack } from '@mui/material';
import { useBloom } from '@bloom-trade/react-sdk';
import { useAccount, useContractWrite } from 'wagmi';
import { erc20ABI } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
const SwapPage: NextPage = () => {
  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    chainId: 137,
    abi: erc20ABI,
    functionName: 'approve',
    args: ['0x034D2685049c4B04AF0e5cb3b196331D8Aa80931', '1000000' as any],
  });
  const { address } = useAccount();
  console.log(address);
  return (
    <div>
      <Stack direction='row' spacing={2}>
        <ConnectButton />
        <Button
          onClick={async () => {
            if (writeAsync) {
              try {
                await writeAsync({
                  recklesslySetUnpreparedArgs: [
                    '0x034D2685049c4B04AF0e5cb3b196331D8Aa80931',
                    '1000000' as any,
                  ],
                });
              } catch (error) {
                console.log(error);
              }
            }
          }}
        >
          Test
        </Button>
      </Stack>
    </div>
  );
};

export default SwapPage;
