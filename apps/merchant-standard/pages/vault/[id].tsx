import Bloom, { StableCoin } from '@bloom-trade/types';
import {
  convertDecimalsUnitToToken,
  formatWalletAddress,
  getBlockchainExplorerName,
  getTokenContractMetadataBySymbolAndChain,
} from '@bloom-trade/utilities';
import { Button } from '@mui/material';
import type { NextPage } from 'next';
import SecuredPage from '../../src/components/layout/securedPage';
import withPreCheckVaultDetail from '../../src/controls/hoc/Vault/index';
import {
  AddressInformation,
  VaultDetail,
  useBloom,
} from '@bloom-trade/react-sdk';
import Iconify from '../../src/components/Iconify';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { ethers } from 'ethers';
import { showAlert } from '../../src/components/alert/handler';
import useSafe from '../../../../packages/bloom-react-sdk/dist/esm/hooks/useSafe';

interface Props {
  vault: Bloom.Vault;
  transactions: any[];
}
const VaultDetailPage: NextPage<Props> = ({ vault, transactions }) => {
  console.log(transactions);
  const [isWalletVerified, setIsWalletVerified] = useState(false);
  const { isConnected } = useAccount();
  const router = useRouter();
  const { Connect } = useBloom();
  const { sendToken } = useSafe();
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
  return (
    <SecuredPage
      currentLink='vaults'
      title='Vault'
      actions={
        <>
          <Button
            variant='outlined'
            onClick={() => {
              router.back();
            }}
            startIcon={<Iconify icon='material-symbols:arrow-back' />}
          >
            Back
          </Button>

          <AddressInformation address={vault.address} chain={vault.chain} />
        </>
      }
      subTitle={`${formatWalletAddress(
        vault.address
      )} in ${getBlockchainExplorerName(vault.chain)}`}
    >
      <VaultDetail
        onCreateTx={async (params) => {
          const safeTx = await sendToken(
            {
              to: params.to,
              amount: convertDecimalsUnitToToken(
                params.amount.toString(),
                getTokenContractMetadataBySymbolAndChain(
                  params.token as StableCoin,
                  vault.chain as Bloom.Chain
                )?.decimals as number
              ),
              token: getTokenContractMetadataBySymbolAndChain(
                params.token as StableCoin,
                vault.chain as Bloom.Chain
              )?.address as `0x${string}`,
            },
            vault.address,
            'goerli'
          );
          console.log(safeTx);
        }}
        vaultTransactions={transactions}
        vault={vault}
        chain={vault.chain}
        isConnected={isConnected}
        walletConnectButton={<Connect />}
        isWalletVerified={isWalletVerified}
        onSign={() => {
          signMessage();
        }}
      />
    </SecuredPage>
  );
};

export default withPreCheckVaultDetail(VaultDetailPage);
