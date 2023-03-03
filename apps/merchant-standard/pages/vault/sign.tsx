import { BloomReact, useBloom, useSafe } from '@bloom-trade/react-sdk';
import type { NextPage } from 'next';
import { useAccount, useSignMessage } from 'wagmi';
import { authService } from '../../src/services/auth.services';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import withPreCheckSignVault from '../../src/controls/hoc/Vault/sign';
import { ethers } from 'ethers';
import { useState } from 'react';
import { showAlert } from '../../src/components/alert/handler';
import { Button } from '@mui/material';
import { Chain } from '@bloom-trade/types';

interface Props {
  tx: SafeMultisigTransactionResponse;
  vault: {
    address: string;
    chain: Chain | 'goerli';
    owners: string[];
    threshold: number;
    balance: { asset: string; amount: string }[];
  };
}

const VaultSign: NextPage<Props> = ({ tx, vault }) => {
  const { Connect } = useBloom();
  const { isConnected } = useAccount();
  const [isWalletVerified, setIsWalletVerified] = useState(false);
  const { signTransaction } = useSafe();

  const { signMessage } = useSignMessage({
    message: 'Bloom Trade Verification',
    onSuccess: (data) => {
      const verifiedAddress = ethers.utils.verifyMessage(
        'Bloom Trade Verification',
        data
      );
      if (vault.owners?.includes(verifiedAddress)) {
        setIsWalletVerified(true);
      } else {
        showAlert('You are not an owner of this vault', 'error');
      }
    },
  });

  const previewTransaction = () => {
    return (
      <>
        <Button
          onClick={() => {
            signTransaction(vault.chain, vault.address, tx.safeTxHash);
          }}
        >
          Sign transaction
        </Button>
      </>
    );
  };
  return (
    <BloomReact
      credentials={authService.getToken() as string}
      useTestnet={process.env.MODE === 'DEV' ? true : false}
    >
      <>
        {!isConnected ? (
          <Connect chain={vault.chain} />
        ) : isWalletVerified ? (
          <>{previewTransaction()}</>
        ) : (
          <>
            <>
              <Button
                onClick={() => {
                  signMessage();
                }}
              >
                Unlock vault
              </Button>
            </>
          </>
        )}
      </>
    </BloomReact>
  );
};

export default withPreCheckSignVault(VaultSign);
