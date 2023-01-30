import { styled, useTheme } from '@mui/material'
import React from 'react'

export interface SonarTwoCirclePros {
  color: string
}
const SonarTwoCircle = (props: SonarTwoCirclePros): JSX.Element => {
  const { color } = props

  const Span = styled('span')`
    width: 48px;
    height: 48px;
    display: inline-block;
    position: relative;
    &:after,
    &before {
      content: '';
      box-sizing: border-box;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid ${color};
      position: absolute;
      left: 0;
      top: 0;
      animation: animloader 2s linear infinite;
    }
    ,
    &:after {
      animation-delay: 1s;
    }
    @keyframes animloader {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
  `

  return <Span />
}

export default SonarTwoCircle
