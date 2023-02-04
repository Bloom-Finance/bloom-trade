import { styled, useTheme } from '@mui/material'
import React from 'react'
import { getSize, SizeOptions } from '../utils'

export interface SpinCircleSimpleProps {
  color: string
  animate?: boolean
  size?: SizeOptions
}
const SpinCircleSimple = (props: SpinCircleSimpleProps): JSX.Element => {
  const { color, animate = true, size = 'sm' } = props
  const theme = useTheme()

  const Span = styled('span')`
    width: ${getSize(size).width};
    height: ${getSize(size).height};
    border: 5px dotted ${color};
    border-radius: 50%;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    animation: ${animate ? 'rotation 2.5s infinite linear' : 'none'}};
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `

  return <Span />
}

export default SpinCircleSimple
