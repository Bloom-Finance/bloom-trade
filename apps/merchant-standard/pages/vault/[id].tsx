import Bloom from '@bloom-trade/types';
import {
  formatWalletAddress,
  getBlockchainExplorerName,
} from '@bloom-trade/utilities';
import { Button } from '@mui/material';
import type { NextPage } from 'next';
import SecuredPage from '../../src/components/layout/securedPage';
import withPreCheckVaultDetail from '../../src/controls/hoc/Vault/index';
import { AddressInformation } from '@bloom-trade/react-sdk';
import Iconify from '../../src/components/Iconify';
import { useRouter } from 'next/router';

interface Props {
  vault: Bloom.Vault;
}
const VaultDetail: NextPage<Props> = ({ vault }) => {
  const router = useRouter();
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
      <>My page</>
    </SecuredPage>
  );
};

export default withPreCheckVaultDetail(VaultDetail);
