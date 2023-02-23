import Bloom, { Chain } from '@bloom-trade/types'
import { List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import {
  EthereumTxWithTransfersResponse,
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionWithTransfersResponse,
} from '@safe-global/safe-service-client'
import React from 'react'
import BalancesCards from '../../Cards/balances'
import Iconify from '../../Iconify'
import VaultDetailLocked from './locked'
import moment from 'moment'
import AddressInformation from '../../AddressInformation'
import { formatWalletAddress, getBlockchainExplorerName } from '@bloom-trade/utilities'
import Blockies from 'react-blockies'

export interface Props {
  vault: Bloom.Vault
  vaultTransactions: (
    | SafeModuleTransactionWithTransfersResponse
    | SafeMultisigTransactionWithTransfersResponse
    | EthereumTxWithTransfersResponse
  )[]
  chain: Chain | 'goerli'
  isConnected?: boolean
  walletConnectButton: JSX.Element
  isWalletVerified: boolean
  onSign: () => void
}

const VaultDetail = (props: Props): JSX.Element => {
  if (!props.isWalletVerified) return <VaultDetailLocked {...props} />
  return (
    <Stack direction='column'>
      {props.vault.balance.map((balance) => {
        return (
          <BalancesCards
            key={balance.asset}
            token={balance.asset}
            chain={props.chain as Chain}
            balance={balance.amount}
          />
        )
      })}
      <List>
        <ListItemText>Transactions</ListItemText>
        {props.vaultTransactions.map((tx, index) => {
          return (
            <ListItem
              secondaryAction={
                <>
                  {tx.transfers[0].to === props.vault.address ? (
                    <Stack direction='row' alignItems='center'>
                      <Iconify color='green' icon='mdi:arrow-down' />
                      <Typography>Received</Typography>
                    </Stack>
                  ) : (
                    <Stack direction='row' alignItems='center'>
                      <Iconify color='red' icon='mdi:arrow-up' />
                      <Typography>Sent</Typography>
                    </Stack>
                  )}
                </>
              }
              key={index}
            >
              {moment(tx.executionDate).format('DD/MM/YYYY HH:mm:ss')}
            </ListItem>
          )
        })}
        <ListItemText>Owners</ListItemText>
        {props.vault.owners?.map((owner, index) => (
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
      </List>
    </Stack>
  )
}

export default VaultDetail
