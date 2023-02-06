import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Drawer, Stack, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../hooks/useResponsive";
import Iconify from "../Iconify";
import NoItemsCard from "../noItemsCard";
import WalletInfo from "../walletCard/walletInfoForm";
import { WalletCard } from "@bloom-trade/react-sdk";
import _ from "lodash";
import { UserStore } from "../../store/user.store";
import useWallets from "../../hooks/useWallets";
import Loader from "../loader";

interface Props {}

const Component = (props: Props): JSX.Element => {
  const mdUp = useResponsive("up", "md");
  const user = UserStore.useState((s) => s);
  const [showWalletInfo, setShowWalletInfo] = React.useState(false);
  const { wallets, loading, loadWallets, refreshOneWallet, isRefreshingWallet, createNewCryptoWallet } = useWallets(user.id);

  const ModalForm = () => {
    if (!mdUp)
      return (
        <Drawer anchor="bottom" open={showWalletInfo}>
          <Stack p={2}>
            <Typography variant="body1" py={3}>
              To starting collect payments we need that you define where you want to receive payments. We need information about your wallet address, chain and coin of your preference
            </Typography>
            <WalletInfo
              hide={() => setShowWalletInfo(false)}
              callBack={loadWallets}
              onSave={async (walletData) => {
                await createNewCryptoWallet(walletData);
              }}
            />
          </Stack>
        </Drawer>
      );
    return (
      <Dialog
        open={showWalletInfo}
        onClose={() => {}}
        sx={{
          m: 4,
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>Wallet Info</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" py={3}>
              To starting collect payments we need that you define where you want to receive payments. We need information about your wallet address, chain and coin of your preference
            </Typography>
          </DialogContentText>
          <WalletInfo
            hide={() => setShowWalletInfo(false)}
            callBack={loadWallets}
            onSave={async (walletData) => {
              await createNewCryptoWallet(walletData);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  };

  console.log("loading", loading);
  console.log("wallets", wallets);
  if (loading.wallets) return <Loader />;

  return (
    <Stack>
      <ModalForm />
      {!_.isEmpty(wallets) && (
        <Stack direction={mdUp ? "row" : "column"} spacing={4} alignItems="center">
          {wallets?.map((wallet) => (
            <WalletCard isRefreshingWallet={isRefreshingWallet} loadingBalance={loading.balances} key={wallet.address} wallet={wallet} onRefreshWallet={async (w: any) => await refreshOneWallet(w)} />
          ))}
          <Box>
            <Button variant="contained" color="primary" onClick={() => setShowWalletInfo(true)} startIcon={<Iconify icon={"mdi:wallet-add-outline"} />}>
              Add
            </Button>
          </Box>
        </Stack>
      )}

      {_.isEmpty(wallets) && (
        <NoItemsCard
          title="No wallets yet"
          description="You can create a new wallet by clicking the button below"
          actionSection={
            <Stack pt={2}>
              <Button variant="contained" color="primary" onClick={() => setShowWalletInfo(true)} startIcon={<Iconify icon={"mdi:wallet-add-outline"} />}>
                Add wallet
              </Button>
            </Stack>
          }
        />
      )}
    </Stack>
  );
};

export default Component;
