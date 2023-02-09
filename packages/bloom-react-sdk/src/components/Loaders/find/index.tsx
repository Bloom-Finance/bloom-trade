import { styled } from '@mui/material'
import React from 'react'
import styles from './styles.module.css'

export interface FindLoaderProps {
  color: string
}
const FindLoader = (props: FindLoaderProps): JSX.Element => {
  const { color } = props
  const Span = styled('span')`
    width: 48px;
    height: 48px;
    display: block;
    margin: 20px auto;
    position: relative;
    border: 3px solid #000;
    border-radius: 50%;
    box-sizing: border-box;
    animation: animloader 2s linear infinite;
    &:after {
      content: '';
      box-sizing: border-box;
      width: 6px;
      height: 24px;
      background: #000;
      transform: rotate(-45deg);
      position: absolute;
      bottom: -20px;
      left: 46px;
    }
    @keyframes animloader {
      0% {
        transform: translate(-10px, -10px);
      }
      25% {
        transform: translate(-10px, 10px);
      }
      50% {
        transform: translate(10px, 10px);
      }
      75% {
        transform: translate(10px, -10px);
      }
      100% {
        transform: translate(-10px, -10px);
      }
    }
  `
  if (color) return <Span style={{ borderColor: color, border: `3px solid ${color}` }}></Span>
  return <Span></Span>
}

export default FindLoader
