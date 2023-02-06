import { User } from '@bloom-trade/types'
import { Drawer, Modal, Stack, Typography } from '@mui/material'
import React, { FC } from 'react'
import useResponsive from '../../hooks/useResponsive'
import { Header } from '../Header'
import { Logo } from '../Logo'
import { ItemNavigatorSpec, NavigationOptions, NavigatorMenu } from '../Navigator'

export interface PageProps {
  children?: React.ReactNode
  logo: React.ReactNode
  user: User
  header: {
    title: string
    actions?: React.ReactNode
  }
  currentLink: string
  navigationItems: ItemNavigatorSpec[]
}

export const Page: FC<PageProps> = (props) => {
  const { user, logo, navigationItems } = props
  const [showMenu, setShowMenu] = React.useState(false)
  const mdUp = useResponsive('up', 'md')
  return (
    <Stack
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'white',
      }}
      direction={mdUp ? 'row' : 'column'}
    >
      {!mdUp && <Header logo={logo} user={user} sx={{ m: 2 }} onCloseMenu={() => setShowMenu(true)} />}
      <Drawer
        open={showMenu}
        onClose={() => setShowMenu(false)}
        anchor='right'
        sx={{
          width: '100%',
          backgroundColor: 'white',
        }}
      >
        <NavigatorMenu
          user={user}
          items={navigationItems}
          selected={props.currentLink as NavigationOptions}
          logo={logo}
          sx={{
            width: mdUp ? '30%' : '100%',
            backgroundColor: 'white',
          }}
        />
      </Drawer>
      {mdUp && (
        <NavigatorMenu
          items={navigationItems}
          user={user}
          selected={props.currentLink as NavigationOptions}
          logo={logo}
          sx={{
            width: '30%',
          }}
        />
      )}

      <Stack
        p={2}
        pt={mdUp ? 4 : 0}
        width={'100%'}
        pr={4}
        sx={{
          backgroundColor: '#FCFCFD',
        }}
      >
        <Stack direction='row' justifyContent={'space-between'} alignItems='center'>
          <Typography variant='h4' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {props.header.title}
          </Typography>
          {props.header.actions}
        </Stack>
        <Stack pt={mdUp ? 6 : 3}>{props.children}</Stack>
      </Stack>
    </Stack>
  )
}
