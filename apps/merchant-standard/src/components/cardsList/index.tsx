import { Box, Button, Card, Dialog, DialogContent, DialogContentText, DialogTitle, Drawer, IconButton, Stack, Typography, useTheme } from "@mui/material";
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

  const theme = useTheme();
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

  if (loading.wallets) return <Loader />;

  return (
    <Stack>
      <ModalForm />
      {!_.isEmpty(wallets) && (
        <Card
          sx={{
            direction: "row",
            boxShadow: !mdUp ? "none" : "0px 0px 2px rgba(145, 158, 171, 0.24), 0px 16px 32px -4px rgba(145, 158, 171, 0.24)",
          }}
        >
          <Stack direction="row" justifyContent={"space-between"} px={mdUp ? 2 : 0} py={4} alignItems="center">
            <Typography variant="h6">Your wallets declared</Typography>
            {mdUp && (
              <Box>
                <Button variant="outlined" color="primary" size="small" onClick={() => setShowWalletInfo(true)} startIcon={<Iconify icon={"mdi:wallet-add-outline"} />}>
                  New Wallet
                </Button>
              </Box>
            )}
            {!mdUp && (
              <IconButton>
                <Iconify icon={"material-symbols:add-circle-outline-rounded"} color={theme.palette.secondary.main} />
              </IconButton>
            )}
          </Stack>
          <Stack direction={mdUp ? "row" : "column"} spacing={4} alignItems="center" px={2} pb={4}>
            {wallets?.map((wallet) => (
              <WalletCard isRefreshingWallet={isRefreshingWallet} loadingBalance={loading.balances} key={wallet.address} wallet={wallet} onRefreshWallet={async (w: any) => await refreshOneWallet(w)} />
            ))}
          </Stack>
        </Card>
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
