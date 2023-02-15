import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import React, { FC } from 'react'
import useResponsive from '../../hooks/useResponsive'
import Iconify from '../Iconify'

export interface BottomNavProps {
  children: React.ReactNode
}

export const BottomNav: FC<BottomNavProps> = (props) => {
  const mdUp = useResponsive('up', 'md')

  if (mdUp) return <div>Desktop Not Supported</div>

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation>
        <BottomNavigationAction label='Recents' value='recents' icon={<Iconify icon='bx:bx-home' />} />
        <BottomNavigationAction label='Recents' value='recents' icon={<Iconify icon='bx:bx-home' />} />
        <BottomNavigationAction label='Recents' value='recents' icon={<Iconify icon='bx:bx-home' />} />
      </BottomNavigation>
    </Paper>
  )
}
