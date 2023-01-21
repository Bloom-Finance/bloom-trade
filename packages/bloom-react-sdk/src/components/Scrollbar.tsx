// @mui
import { styled } from '@mui/material/styles'
import { Box, SxProps } from '@mui/material'
import React from 'react'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
}))

// ----------------------------------------------------------------------

interface Props {
  sx?: SxProps
  maxHeight?: number
  children: React.ReactNode
}

export default function Scrollbar({ children, sx, ...other }: Props) {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children as any}
      </Box>
    )
  }

  return <RootStyle>{children}</RootStyle>
}
