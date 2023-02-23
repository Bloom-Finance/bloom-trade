import { Testnet, Chain, Asset } from '@bloom-trade/types'
import { formatWalletAddress, getBlockchainExplorerName, getTokenIconBySymbol } from '@bloom-trade/utilities'
import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack } from '@mui/material'
import React from 'react'
import Blockies from 'react-blockies'
import Iconify from '../Iconify'

import AddressInformation from '../AddressInformation'

export interface Props {
  onSeeVault?: () => void
  address: `0x${string}`
  owners: Array<string>
  chain: Chain | Testnet
  connectButton?: JSX.Element
  qrCodeLogoImage: string
  balance: {
    asset: Asset
    amount: string
  }[]
}

const VaultComponent = (props: Props): JSX.Element => {
  const Blockie = () => <Blockies seed={props.address} />

  return (
    <>
      <List sx={{ width: '100%' }}>
        <ListItem secondaryAction={<AddressInformation address={props.address} chain={props.chain} />}>
          <ListItemAvatar>
            <Blockie />
          </ListItemAvatar>
          <ListItemText
            primary={formatWalletAddress(props.address)}
            secondary={getBlockchainExplorerName(props.chain)}
          ></ListItemText>
        </ListItem>
        <ListItem>
          <Stack direction='column'>
            <ListItemText primary='Owners' />
            <Stack direction='row'>
              {props.owners.map((owner, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <AddressInformation
                      address={owner}
                      chain={props.chain}
                      qr={{ enabled: false }}
                      copyToClipBoard={{ enabled: false }}
                    />
                  }
                >
                  <ListItemAvatar>
                    <Blockies seed={owner} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={formatWalletAddress(owner)}
                    secondary={getBlockchainExplorerName(props.chain)}
                  ></ListItemText>
                </ListItem>
              ))}
            </Stack>
          </Stack>
        </ListItem>
        <ListItem>
          <Stack direction='column'>
            <ListItemText primary='Assets' />
            <Stack direction='row'>
              {props.balance.map(({ amount, asset }, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar src={getTokenIconBySymbol(asset)} />
                  </ListItemAvatar>
                  <ListItemText primary={asset.toUpperCase()} secondary={`$${amount}`}></ListItemText>
                </ListItem>
              ))}
            </Stack>
          </Stack>
        </ListItem>
        <ListItemButton>
          <Button
            startIcon={<Iconify icon='ic:baseline-remove-red-eye' />}
            variant='contained'
            onClick={() => {
              props.onSeeVault && props.onSeeVault()
            }}
          >
            See
          </Button>
        </ListItemButton>
      </List>
    </>
  )
}

export default VaultComponent
