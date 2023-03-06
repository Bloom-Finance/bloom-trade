import { Testnet, Chain } from '@bloom-trade/types'
import { getBlockchainExplorerName, getWalletBlockchainExplorer } from '@bloom-trade/utilities'
import { Box, IconButton, Modal, Popover, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useState } from 'react'
import { QRCode } from 'react-qrcode-logo'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Iconify from '../Iconify'

export interface Props {
  address: string
  chain: Chain | Testnet
  qr?: {
    enabled?: boolean
    type?: 'dots' | 'squares'
    logoImage?: string
  }
  copyToClipBoard?: {
    enabled: boolean
  }
  blockchainExplorer?: {
    enabled: boolean
  }
}

const AddressInformation = (props: Props): JSX.Element => {
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
  return (
    <>
      <Stack direction='row'>
        {(props.blockchainExplorer?.enabled || props.blockchainExplorer === undefined) && (
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
        )}
        {(props.qr?.enabled || props.qr === undefined) && (
          <IconButton onClick={handleOpen} onMouseLeave={handlePopoverCloseQr} onMouseEnter={handlePopoverOpenQr}>
            <Iconify icon='material-symbols:qr-code' />
          </IconButton>
        )}
        {(props.copyToClipBoard?.enabled || props.copyToClipBoard === undefined) && (
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
        )}
      </Stack>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <QRCode
            qrStyle={props.qr?.type || 'dots'}
            logoWidth={70}
            value={props.address}
            size={300}
            logoImage={props.qr?.logoImage || 'https://merchant.bloom.trade/apple-touch-icon.png'}
          />
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

export default AddressInformation
