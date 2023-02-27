import Bloom, { Chain } from '@bloom-trade/types'
import {
  Button,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
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
import { formatWalletAddress, getBlockchainExplorerName, isWeb3WalletByAddress } from '@bloom-trade/utilities'
import Blockies from 'react-blockies'
import { Asset } from '@bloom-trade/types'

export interface Props {
  pendingTransactions?: (
    | SafeModuleTransactionWithTransfersResponse
    | SafeMultisigTransactionWithTransfersResponse
    | EthereumTxWithTransfersResponse
  )[]
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
  onCreateTx: (params: { token: Asset; amount: number; to: `0x${string}` }) => void
}

const VaultDetail = (props: Props): JSX.Element => {
  const [tx, setTx] = React.useState<{ token: Asset; amount: number; to: `0x${string}` }>({
    token: props.vault.balance[0].asset,
    amount: 0,
    to: '' as `0x${string}`,
  })
  const [pendingTxs, setPendingTxs] = React.useState<any>()

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
        <ListItemText primary={<Typography variant='h4'>Transactions</Typography>} />
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
        <ListItemText primary={<Typography variant='h4'>Owners</Typography>} />
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
        <ListItemText primary={<Typography variant='h4'>Create a transaction</Typography>} />
        <ListItemText primary={<Typography variant='body1'>Select token</Typography>} />
        <Select
          value={props.vault.balance[0].asset}
          onChange={(e) => {
            setTx({ ...tx, token: e.target.value as Asset })
          }}
        >
          {props.vault.balance.map((v) => {
            return (
              <MenuItem key={v.asset} value={v.asset}>
                {v.asset.toUpperCase()}
              </MenuItem>
            )
          })}
        </Select>
        <ListItemText primary={<Typography variant='body1'>Select amount</Typography>} />
        <Input
          type='number'
          onChange={(e) => {
            setTx({ ...tx, amount: Number(e.target.value) })
          }}
        />
        <ListItemText primary={<Typography variant='body1'>Select destination</Typography>} />
        <Input
          type='string'
          onChange={(e) => {
            setTx({ ...tx, to: e.target.value as `0x${string}` })
          }}
        />
        <Button
          onClick={() => {
            props.onCreateTx(tx)
          }}
          variant='contained'
          disabled={!tx.token || tx.amount === 0 || !isWeb3WalletByAddress(tx.to)}
        >
          Create tx
        </Button>
      </List>
    </Stack>
  )
}

export default VaultDetail
