import Bloom, { StableCoin } from '@bloom-trade/types';
import {
  convertDecimalsUnitToToken,
  formatWalletAddress,
  getBlockchainExplorerName,
  getChainIdByName,
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
import {
  useAccount,
  useNetwork,
  useSignMessage,
  useSwitchNetwork,
} from 'wagmi';
import { ethers } from 'ethers';
import { showAlert } from '../../src/components/alert/handler';
import useSafe from '../../../../packages/bloom-react-sdk/dist/esm/hooks/useSafe';

interface Props {
  vault: Bloom.Vault;
  pendingTxs: any[];
  transactions: any[];
}
const VaultDetailPage: NextPage<Props> = ({
  vault,
  transactions,
  pendingTxs,
}) => {
  const [isWalletVerified, setIsWalletVerified] = useState(false);
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const [pendingTransactions, setPendingTransactions] =
    useState<any[]>(pendingTxs);
  const { isConnected } = useAccount();
  const router = useRouter();
  const { Connect } = useBloom();
  const { sendToken, executeTransaction, getTransactionInfo } = useSafe();
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
        pendingTransactions={pendingTransactions}
        onExecuteTx={async (tx) => {
          try {
            await executeTransaction(vault.address, tx);
            setPendingTransactions((prev) =>
              prev.filter((item) => item.transactionHash !== tx.transactionHash)
            );
          } catch (error) {
            console.log(error);
          }
          //Update array of pending transactions
        }}
        onCreateTx={async (params) => {
          if (chain?.id !== getChainIdByName(vault.chain)) {
            if (!switchNetwork) {
              return;
            }
            switchNetwork(getChainIdByName(vault.chain));
            return;
          }
          const { safeTransaction, txHash } = await sendToken(
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
            vault.chain
          );
          if (params.executeTx) {
            await executeTransaction(vault.address, safeTransaction);
          }
          const txInfo = await getTransactionInfo(txHash, vault.chain, {
            infura: {
              projectId: process.env.INFURA_PROJECT_ID as string,
            },
          });
          setPendingTransactions((prev) => [...prev, txInfo]);
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
