import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { Button, Stack } from '@mui/material';
import { useBloom } from '@bloom-trade/react-sdk';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { erc20ABI } from 'wagmi';
const SwapPage: NextPage = () => {
  const { Connect } = useBloom();
  const config = usePrepareContractWrite({
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    abi: erc20ABI,
    functionName: 'approve',
    args: ['0xf07e49801ef7ae4e7DEcF260Cb1F9FD258169dF4', '1000000' as any],
  });
  const { write } = useContractWrite(config as any);
  return (
    <div>
      <Stack direction='row' spacing={2}>
        <Connect />
        <Button
          onClick={() => {
            if (write) {
              write();
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
