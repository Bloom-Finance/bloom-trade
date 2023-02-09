import { styled, useTheme } from '@mui/material'
import React from 'react'

export interface SonarOneCirclePros {
  color: string
}
const SonarOneCircle = (props: SonarOneCirclePros): JSX.Element => {
  const { color } = props
  const theme = useTheme()

  const hex2rgba = (hex: any, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map((x: any) => parseInt(x, 16))
    return `rgba(${r},${g},${b},${alpha})`
  }

  const Span = styled('span')`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 6rem;
    margin-top: 3rem;
    margin-bottom: 3rem;
    &:before,
    &:after {
      content: '';
      position: absolute;
      border-radius: 50%;
      animation: pulsOut 1.8s ease-in-out infinite;
      filter: drop-shadow(0 0 1rem ${hex2rgba(color, 0.5)});
    }
    ,
    &:before {
      width: 100%;
      padding-bottom: 100%;
      box-shadow: inset 0 0 0 1rem ${color};
      animation-name: pulsIn;
    }
    ,
    &:after {
      width: calc(100% - 2rem);
      padding-bottom: calc(100% - 2rem);
      box-shadow: 0 0 0 0 ${color};
    }

    @keyframes pulsIn {
      0% {
        box-shadow: inset 0 0 0 1rem ${color};
        opacity: 1;
      }
      50%,
      100% {
        box-shadow: inset 0 0 0 0 ${color};
        opacity: 0;
      }
    }

    @keyframes pulsOut {
      0%,
      50% {
        box-shadow: 0 0 0 0 ${color};
        opacity: 0;
      }
      100% {
        box-shadow: 0 0 0 1rem ${color};
        opacity: 1;
      }
    }
  `

  return <Span />
}

export default SonarOneCircle
