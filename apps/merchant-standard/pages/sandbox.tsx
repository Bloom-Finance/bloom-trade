import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { Button, Input, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import BloomIpfs from '@bloom-trade/ipfs';
import axios from 'axios';
const SandboxPage: NextPage = () => {
  const [dataToEncrypt, setDataToEncrypt] = useState<string>('');
  return (
    <>
      <Stack direction='row' p={5} width={500}>
        <Stack m={2}>
          <Typography variant='h4' p={5}>
            Encrypt
          </Typography>
          <Stack m={2}>
            <Input
              onChange={(e) => {
                setDataToEncrypt(e.target.value);
              }}
            />
            <Button
              onClick={async () => {
                const { data } = await axios.post('/api/ipfs/encrypt', {
                  data: dataToEncrypt,
                });
                console.log(data);
              }}
              variant='contained'
            >
              Encrypt
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default SandboxPage;
