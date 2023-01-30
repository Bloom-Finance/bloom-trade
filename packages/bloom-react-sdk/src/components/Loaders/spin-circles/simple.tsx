import { styled, useTheme } from '@mui/material'
import React from 'react'

export interface SpinCircleSimpleProps {
  color: string
}
const SpinCircleSimple = (props: SpinCircleSimpleProps): JSX.Element => {
  const { color } = props
  const theme = useTheme()

  const hex2rgba = (hex: any, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map((x: any) => parseInt(x, 16))
    return `rgba(${r},${g},${b},${alpha})`
  }

  const Span = styled('span')`
    width: 48px;
    height: 48px;
    border: 5px dotted ${color};
    border-radius: 50%;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    animation: rotation 2s linear infinite;
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
