import { Order, Testnet } from '@bloom-trade/types'
import {
  capitalize,
  formatWalletAddress,
  getTestnetFromMainnet,
  getWalletBlockchainExplorer,
} from '@bloom-trade/utilities'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import React from 'react'
import { BloomStore } from '../../../../store/BloomReact'
import AddressInformation from '../../../AddressInformation'

export interface Props {
  order: Order
  actions: {
    button: JSX.Element
  }
  testnet?: boolean
}
function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  }
}
const SummaryComponent = (props: Props): JSX.Element => {
  const isTestnet = BloomStore.useState((s) => s.testnet)
  return (
    <List sx={{ width: '100%' }}>
      <ListItem
        secondaryAction={
          <AddressInformation
            address={props.order.destination.address}
            chain={props.order.destination.chain}
            qr={{ enabled: false }}
            copyToClipBoard={{ enabled: false }}
          />
        }
      >
        <ListItemAvatar>
          {props.order.destination.description?.image && <Avatar src={props.order.destination.description.image} />}
          {props.order.destination.description?.name && !props.order.destination.description.image && (
            <Avatar {...stringAvatar(props.order.destination.description.name)} />
          )}
        </ListItemAvatar>
        <ListItemText
          primary={props.order.destination.description?.name || formatWalletAddress(props.order.destination.address)}
          secondary={`${capitalize(props.order.destination.chain)} ${
            isTestnet || props.testnet ? `(${getTestnetFromMainnet(props.order.destination.chain) as Testnet})` : ''
          }, ${props.order.destination.token.toUpperCase()}`}
        ></ListItemText>
      </ListItem>
      <ListItemButton>{props.actions.button}</ListItemButton>
    </List>
  )
}

export default SummaryComponent
