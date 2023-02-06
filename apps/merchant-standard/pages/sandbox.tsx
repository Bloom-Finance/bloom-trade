import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useBloom } from '@bloom-trade/react-sdk';
import { Button, Input, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { aes256Encrypt, getKeyAndIV } from '@bloom-trade/utilities';
import { useSigner } from 'wagmi';
const SandboxPage: NextPage = () => {
  const [dataToEncrypt, setDataToEncrypt] = useState<string>('');
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const { data: signer } = useSigner();
  const { Connect } = useBloom();
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return (
    <>
      <Stack width={500}>
        <Typography variant='h4' p={5}>
          Connect your wallet
        </Typography>
        {hasMounted && <Connect />}
      </Stack>

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
          </Stack>

          <Button
            disabled={!signer}
            onClick={async () => {
              const encryptedData = aes256Encrypt(
                dataToEncrypt,
                getKeyAndIV().key,
                getKeyAndIV().ivLength
              );
              if (!signer) throw new Error('Signer not found');
              const string = await signer.signMessage(encryptedData);
              console.log(string);
            }}
            variant='contained'
          >
            Encrypt
          </Button>
          {encryptedData && (
            <Typography variant='body1' p={5}>
              {encryptedData}
            </Typography>
          )}
        </Stack>

        <Stack m={2}>
          <Typography variant='h4' p={5}>
            Decrypt
          </Typography>
          <Stack m={2}>
            <Input
              onChange={(e) => {
                setDataToEncrypt(e.target.value);
              }}
            />
          </Stack>

          <Button
            onClick={() => {
              setEncryptedData(
                aes256Encrypt(
                  dataToEncrypt,
                  getKeyAndIV().key,
                  getKeyAndIV().ivLength
                )
              );
            }}
            variant='contained'
          >
            Decrypt
          </Button>
          {encryptedData && (
            <Typography variant='body1' p={5}>
              {encryptedData}
            </Typography>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default SandboxPage;
