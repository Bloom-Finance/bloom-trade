import { User } from '@bloom-trade/types'
import { IconButton, Stack } from '@mui/material'
import React, { FC } from 'react'
import useResponsive from '../../hooks/useResponsive'
import Iconify from '../Iconify'
import { UserComponent } from '../User'

export interface HeaderProps {
  logo: React.ReactNode
  children?: React.ReactNode
  user: User
  sx?: any
  onCloseMenu: () => void
}

export const Header: FC<HeaderProps> = (props) => {
  const mdUp = useResponsive('up', 'md')

  return (
    <Stack
      direction='row'
      spacing={2}
      justifyContent='space-between'
      alignItems={'center'}
      sx={{
        ...props.sx,
        borderBottom: mdUp ? '1px solid #E5E5E5' : 'none',
        pb: mdUp ? 2 : 0,
      }}
    >
      {props.logo}
      {mdUp && (
        <Stack direction='row' spacing={2} alignItems='center'>
          <Iconify icon='ph:bell-ringing-duotone' fontSize={26} sx={{ color: 'text.secondary' }} />
        </Stack>
      )}
      {!mdUp && (
        <Stack direction='row' spacing={4}>
          <IconButton onClick={props.onCloseMenu}>
            <Iconify
              icon='material-symbols:left-panel-open-outline-rounded'
              fontSize={26}
              sx={{
                color: 'text.secondary',
              }}
            />
          </IconButton>
        </Stack>
      )}
    </Stack>
  )
}
