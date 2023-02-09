import { Stack } from '@mui/material'
import React, { FC } from 'react'
import useResponsive from '../../hooks/useResponsive'

export interface LogoProps {
  image: {
    small: React.ReactNode
    large: React.ReactNode
  }
}

export const Logo: FC<LogoProps> = (props) => {
  const mdUp = useResponsive('up', 'md')
  return (
    <Stack width={!mdUp ? '36px' : '100%'} height={!mdUp ? '36px' : '100%'}>
      {mdUp ? props.image.large : props.image.small}
    </Stack>
  )
}
