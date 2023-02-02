import { User } from '@bloom-trade/types'
import { hex2rgba } from '@bloom-trade/utilities'
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
} from '@mui/material'
import React, { FC } from 'react'
import useResponsive from '../../hooks/useResponsive'
import Iconify from '../Iconify'
import { Logo } from '../Logo'
import { UserComponent } from '../User'

export interface NavigatorMenuProps {
  children?: React.ReactNode
  selected: NavigationOptions
  user: User
  logo?: React.ReactNode
  sx?: any
}
export type NavigationOptions = 'overview' | 'payment-request' | 'plugins-integrations' | 'payouts' | 'my-wallets'
const items = [
  {
    id: 'overview',
    icon: 'iconoir:stats-down-square',
    text: 'Overview',
  },
  {
    id: 'my-wallets',
    icon: 'uiw:pay',
    text: 'My Wallets',
  },
  {
    id: 'payment-request',
    icon: 'ph:rocket',
    text: 'Payment Request',
  },
  {
    id: 'payouts',
    icon: 'icon-park-outline:bitcoin',
    text: 'Payout',
  },
  {
    id: 'plugins-integrations',
    icon: 'clarity:plugin-outline-badged',
    text: 'Plugins',
  },
]

export const NavigatorMenu: FC<NavigatorMenuProps> = (props) => {
  const { selected, sx } = props
  const mdUp = useResponsive('up', 'md')
  const theme = useTheme()
  return (
    <Stack
      height={'100%'}
      direction='column'
      justifyContent={'space-between'}
      spacing={2}
      sx={{
        ...sx,
        maxWidth: mdUp ? 300 : '100%',
        borderRight: mdUp ? `1px solid ${hex2rgba(theme.palette.text.secondary, 0.2)}` : 'none',
      }}
    >
      {mdUp && (
        <Stack px={4} pt={4} pb={mdUp ? 2 : 2}>
          {props.logo}
        </Stack>
      )}
      <Stack direction='column' justifyContent={'space-between'} spacing={2} height='100%'>
        <List
          sx={{
            px: 2,
            pt: !mdUp ? 4 : 0,
          }}
        >
          {items.map((item) => (
            <ListItem
              key={item.text}
              sx={{
                backgroundColor: selected === item.id ? hex2rgba(theme.palette.primary.light, 0.12) : 'transparent',
                // border: selected === item.id ? `1px solid ${hex2rgba(theme.palette.primary.light, 0.2)}` : 'none',
                borderRadius: '8px',
                height: 48,
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <Iconify
                    icon={item.icon}
                    fontSize={24}
                    sx={{
                      color: selected === item.id ? theme.palette.primary.light : theme.palette.text.secondary,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    color: selected === item.id ? theme.palette.primary.light : theme.palette.text.secondary,
                    fontWeight: selected === item.id ? 'semi-bold' : 'regular',
                    variant: 'body2',
                  }}
                  primary={item.text}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Stack direction='column'>
          <Divider />
          <List
            sx={{
              px: 2,
            }}
          >
            <ListItem
              secondaryAction={
                <IconButton edge='end' aria-label='comments'>
                  <Iconify icon='bx:bx-log-out' fontSize={24} />
                </IconButton>
              }
              disablePadding
            >
              <UserComponent
                user={props.user}
                size={'md'}
                sx={{
                  px: 2,
                }}
              />
            </ListItem>
          </List>
        </Stack>
      </Stack>
    </Stack>
  )
}
