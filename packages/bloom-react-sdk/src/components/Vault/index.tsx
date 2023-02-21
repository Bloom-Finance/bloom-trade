import { Testnet, Chain } from '@bloom-trade/types'
import { formatWalletAddress, getBlockchainExplorerName, getWalletBlockchainExplorer } from '@bloom-trade/utilities'
import { Button, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack } from '@mui/material'
import React from 'react'
import Blockies from 'react-blockies'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Iconify from '../Iconify'
export interface Props {
  address: `0x${string}`
  owners: Array<string>
  chain: Chain | Testnet
}
const VaultComponent = (props: Props): JSX.Element => {
  const Blockie = () => <Blockies seed={props.address} />
  return (
    <List sx={{ width: '100%' }}>
      <ListItem
        secondaryAction={
          <IconButton
            onClick={() => {
              window.open(getWalletBlockchainExplorer(props.address, props.chain))
            }}
            aria-label='address-info'
          >
            <OpenInNewIcon />
          </IconButton>
        }
      >
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
                  <IconButton
                    onClick={() => {
                      window.open(getWalletBlockchainExplorer(owner, props.chain))
                    }}
                    aria-label='address-info'
                  >
                    <OpenInNewIcon />
                  </IconButton>
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
      <ListItemButton>
        <Button startIcon={<Iconify icon='material-symbols:lock-open-rounded' />} variant='contained'>
          Open
        </Button>
      </ListItemButton>
    </List>
  )
}

export default VaultComponent
