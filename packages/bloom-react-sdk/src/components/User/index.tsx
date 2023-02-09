import { User } from '@bloom-trade/types'
import { Avatar, Stack, Typography } from '@mui/material'
import React, { FC } from 'react'

export interface UserComponentProps {
  user: User
  size: 'sm' | 'md' | 'lg'
  sx?: any
}

export const UserComponent: FC<UserComponentProps> = (props) => {
  const { user, size, sx } = props

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'small'
      case 'md':
        return 'medium'
      case 'lg':
        return 'large'
    }
  }
  return (
    <Stack direction='row' spacing={2} alignItems={'center'} sx={sx} py={1}>
      <Avatar
        sizes={getSize()}
        sx={{
          bgcolor: 'primary.light',
        }}
      >
        {user.displayName &&
          user.displayName
            .split(' ')
            .map((e) => e.charAt(0))
            .join('')
            .toUpperCase()}
      </Avatar>
      {size !== 'sm' && (
        <Stack>
          <Typography variant='body1'>{user.displayName}</Typography>
          <Typography variant='caption'>{user.email}</Typography>
        </Stack>
      )}
    </Stack>
  )
}
