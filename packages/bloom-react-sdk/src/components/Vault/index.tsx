import { Testnet, Chain, Asset } from '@bloom-trade/types'
import {
  formatWalletAddress,
  getBlockchainExplorerName,
  getTokenIconBySymbol,
  getWalletBlockchainExplorer,
} from '@bloom-trade/utilities'
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import Blockies from 'react-blockies'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Iconify from '../Iconify'
import Modal from '@mui/material/Modal'
import { QRCode } from 'react-qrcode-logo'

export interface Props {
  isConnected: boolean
  walletConnectButton: JSX.Element
  onRequestSign?: (owners: string[]) => void
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
  const [openModal, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [hasCopiedToClipBoard, setHasCopiedToClipBoard] = useState(false)
  const [anchorElClipboard, setAnchorElClipboard] = React.useState<HTMLElement | null>(null)
  const [anchorElScanner, setAnchorElScanner] = React.useState<HTMLElement | null>(null)
  const [anchorElQr, setAnchorElQr] = React.useState<HTMLElement | null>(null)

  const handlePopoverOpenClipboard = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElClipboard(event.currentTarget)
  }

  const handlePopoverOpenQr = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElQr(event.currentTarget)
  }

  const handlePopoverOpenScanner = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElScanner(event.currentTarget)
  }

  const handlePopoverCloseClipboard = () => {
    setAnchorElClipboard(null)
  }

  const handlePopoverCloseQr = () => {
    setAnchorElQr(null)
  }

  const handlePopoverCloseScanner = () => {
    setAnchorElScanner(null)
  }

  const openClipboard = Boolean(anchorElClipboard)
  const openQrCode = Boolean(anchorElQr)
  const openScanner = Boolean(anchorElScanner)
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '64px',
    boxShadow: 24,
    p: 4,
  }

  return (
    <>
      <List sx={{ width: '100%' }}>
        <ListItem
          secondaryAction={
            <IconButton
              onMouseLeave={handlePopoverCloseScanner}
              onMouseEnter={handlePopoverOpenScanner}
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
          <IconButton onClick={handleOpen} onMouseLeave={handlePopoverCloseQr} onMouseEnter={handlePopoverOpenQr}>
            <Iconify icon='material-symbols:qr-code' />
          </IconButton>
          <IconButton
            onMouseEnter={handlePopoverOpenClipboard}
            onMouseLeave={() => {
              handlePopoverCloseClipboard()
              setTimeout(() => {
                setHasCopiedToClipBoard(false)
              }, 1000)
            }}
            onClick={() => {
              navigator.clipboard.writeText(props.address)
              setHasCopiedToClipBoard(true)
            }}
          >
            <Iconify icon='material-symbols:content-copy-outline' />
          </IconButton>
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
          {props.isConnected ? (
            <Button
              startIcon={<Iconify icon='material-symbols:lock' />}
              variant='contained'
              onClick={() => {
                props.onRequestSign && props.onRequestSign(props.owners)
              }}
            >
              Open
            </Button>
          ) : (
            props.walletConnectButton
          )}
        </ListItemButton>
      </List>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <QRCode qrStyle='dots' logoWidth={70} value={props.address} size={300} logoImage={props.qrCodeLogoImage} />
        </Box>
      </Modal>
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none',
        }}
        open={openClipboard}
        anchorEl={anchorElClipboard}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverCloseClipboard}
        disableRestoreFocus
      >
        {!hasCopiedToClipBoard ? (
          <Typography sx={{ p: 1 }}>Copy to clipboard</Typography>
        ) : (
          <Typography sx={{ p: 1 }}> Copied!!</Typography>
        )}
      </Popover>
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none',
        }}
        open={openQrCode}
        anchorEl={anchorElQr}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverCloseQr}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>Open qr modal</Typography>
      </Popover>
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none',
        }}
        open={openScanner}
        anchorEl={anchorElScanner}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverCloseScanner}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{getBlockchainExplorerName(props.chain)}</Typography>
      </Popover>
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none',
        }}
        open={openClipboard}
        anchorEl={anchorElClipboard}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverCloseClipboard}
        disableRestoreFocus
      >
        {!hasCopiedToClipBoard ? (
          <Typography sx={{ p: 1 }}>Copy to clipboard</Typography>
        ) : (
          <Typography sx={{ p: 1 }}> Copied!!</Typography>
        )}
      </Popover>
    </>
  )
}

export default VaultComponent
