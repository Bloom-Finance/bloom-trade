import Bloom, { Chain } from '@bloom-trade/types'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
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
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types'
import TabsComponent from '../../Tabs'
import AccordionComponent from '../../Accordion'

export interface Props {
  pendingTransactions?: SafeMultisigTransactionResponse[]
  vault: Bloom.Vault
  vaultTransactions: (
    | SafeModuleTransactionWithTransfersResponse
    | SafeMultisigTransactionWithTransfersResponse
    | EthereumTxWithTransfersResponse
  )[]
  chain: Chain | 'goerli'
  isConnected?: boolean
  connectedWalletAddress?: string
  walletConnectButton: JSX.Element
  isWalletVerified: boolean
  onSign: () => void
  onCreateTx: (params: { token: Asset; amount: number; to: `0x${string}`; executeTx: boolean }) => void
  onExecuteTx: (tx: SafeMultisigTransactionResponse) => void
}

const VaultDetail = (props: Props): JSX.Element => {
  const [tx, setTx] = React.useState<{ token: Asset; amount: number; to: `0x${string}`; executeTx: boolean }>({
    token: props.vault.balance && props.vault.balance.length > 0 ? props.vault.balance[0].asset : 'dai',
    amount: 0,
    to: '' as `0x${string}`,
    executeTx: false,
  })

  if (!props.isWalletVerified) return <VaultDetailLocked {...props} />
  const onGenerateUrl = (tx: SafeMultisigTransactionResponse) => {
    navigator.clipboard.writeText(
      location.origin + '/vault/sign?tx=' + tx.safeTxHash + '&address=' + props.vault.address + '&chain=' + props.chain,
    )
  }
  const pendingTransactionsComponent = () => {
    return (
      <>
        {props.pendingTransactions && props.pendingTransactions.length === 0 ? (
          <Typography>No pending transactions</Typography>
        ) : (
          props.pendingTransactions?.map((tx, index) => (
            <AccordionComponent
              key={index}
              accordion={{
                summary: (
                  <Stack direction={'row'} spacing={2}>
                    <Blockies seed={tx.to} />
                    <Typography>{formatWalletAddress(tx.to)}</Typography>
                  </Stack>
                ),
                details: (
                  <>
                    <Typography>{tx.confirmationsRequired} confirmations need to be required</Typography>
                    <Typography>You have {tx.confirmations?.length || '0'}</Typography>
                    {!tx.confirmations ||
                      (tx.confirmationsRequired > tx.confirmations.length && (
                        <Button
                          onClick={() => {
                            onGenerateUrl(tx)
                          }}
                        >
                          Generate url
                        </Button>
                      ))}
                    {!tx.confirmations ||
                      !props.connectedWalletAddress ||
                      tx.confirmations.filter((confirmation) => confirmation.owner === props.connectedWalletAddress)
                        .length !== 0 ||
                      (tx.confirmationsRequired > tx.confirmations?.length && (
                        <Button onClick={() => props.onSign()}>Sign</Button>
                      ))}
                    {tx.isExecuted ? (
                      <>Tx has been executed</>
                    ) : (
                      <Button
                        disabled={!tx.confirmations || tx.confirmationsRequired > tx.confirmations?.length}
                        onClick={() => {
                          props.onExecuteTx(tx)
                        }}
                      >
                        Execute
                      </Button>
                    )}
                  </>
                ),
              }}
            />
          ))
        )}
      </>
    )
  }
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
        <TabsComponent
          tabs={[
            {
              component: <>{pendingTransactionsComponent()}</>,
              label: 'Queue',
            },
            {
              component: (
                <>
                  {props.vaultTransactions.map((tx, index) => {
                    if (tx.transfers.length === 0) return
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
                </>
              ),
              label: 'Transactions',
            },
          ]}
        />

        <ListItemText primary={<Typography variant='subtitle1'>Owners</Typography>} />
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
        <ListItemText primary={<Typography variant='subtitle1'>Create a transaction</Typography>} />
        <ListItemText primary={<Typography variant='body1'>Select token</Typography>} />
        <Select
          value={props.vault.balance && props.vault.balance.length > 0 ? props.vault.balance[0].asset : 'dai'}
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
        {/* Se puede ejecutar la transaccion si y solo si el owner es unico */}
        <FormGroup>
          <FormControlLabel
            disabled={props.vault.owners?.length !== 1}
            control={
              <Checkbox
                defaultChecked={tx.executeTx}
                onChange={() => {
                  setTx({ ...tx, executeTx: !tx.executeTx })
                }}
              />
            }
            label='Execute transaction'
          />
        </FormGroup>
        <Button
          onClick={async () => {
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
