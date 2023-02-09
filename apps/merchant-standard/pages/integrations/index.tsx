import { Stack } from "@mui/system";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import SecuredPage from "../../src/components/layout/securedPage";
import InternalContainer from "../../src/components/layout/internalContainer";
import Card from "../../src/components/cards/PlugIn";
import Label from "../../src/components/label";
import { Box, Grid } from "@mui/material";
import { UserStore } from "../../src/store/user.store";

const IntegrationsPage: NextPage = () => {
  const user = UserStore.useState((s) => s);
  return (
    <SecuredPage currentLink="plugins-integrations">
      <InternalContainer
        title="Plugins"
        breadCum={[
          {
            title: "Plugins List",
            goTo: "/integrations",
          },
        ]}
      >
        <Grid container gap={2}>
          <Grid item xs={12} md={6} lg={5}>
            <Card
              brand="circle"
              name="Circle"
              text="A global financial technology company helping money move at internet speed through the power of USDC and Euro Coin"
              configureGoTo="/integrations/circle"
              labels={
                <Stack direction="row" spacing={1}>
                  <Box>
                    {user.circleApiKey ? (
                      <Label variant="filled" color="success">
                        Enabled
                      </Label>
                    ) : (
                      <Label variant="filled" color="error">
                        Disabled
                      </Label>
                    )}
                  </Box>
                  <Box>
                    <Label variant="filled" color="info">
                      Withdraw
                    </Label>
                  </Box>
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Card
              brand="transak"
              name="Transak"
              text="Enable users to buy or sell crypto. Available across 130 bank transfers and other payment methods in 125+ countries"
              configureGoTo="/integrations/transak"
              labels={
                <Stack direction="row" spacing={1}>
                  <Box>
                    {user.transakApiKey ? (
                      <Label variant="filled" color="success">
                        Enabled
                      </Label>
                    ) : (
                      <Label variant="filled" color="error">
                        Disabled
                      </Label>
                    )}
                  </Box>
                  <Box>
                    <Label variant="filled" color="info">
                      Withdraw
                    </Label>
                  </Box>
                  <Box>
                    <Label variant="filled" color="error">
                      Only Europe
                    </Label>
                  </Box>
                </Stack>
              }
            />
          </Grid>
        </Grid>
      </InternalContainer>
    </SecuredPage>
  );
};

export default IntegrationsPage;
