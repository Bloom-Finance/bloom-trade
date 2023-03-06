import { Stack, styled, useTheme } from '@mui/material'
import React from 'react'
import Iconify from '../../Iconify'
import { getSize, SizeOptions } from '../utils'

export interface ReloadProps {
  color: string
  animate?: boolean
  size?: SizeOptions
}
const Reload = (props: ReloadProps): JSX.Element => {
  const { animate = true, size = 'sm', color } = props
  const theme = useTheme()

  const IconifyStyled = styled(Stack)`
    width: ${getSize(size).width};
    height: ${getSize(size).height};
    border-radius: 50%;
    display: inline-block;
    border-top: 4px solid #fff;
    border-right: 4px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;

    &:after {
      content: '';
      box-sizing: border-box;
      position: absolute;

      width: ${getSize(size).width};
      height: ${getSize(size).height};
      border-radius: 50%;
      border-bottom: 4px solid ${color};
      border-left: 4px solid transparent;
    }
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `

  return (
    <Stack>
      <IconifyStyled />
    </Stack>
  )
}

export default Reload
