import styled from '@emotion/styled'
import { Stack } from '@mui/material'
import React, { FC } from 'react'

export interface LoaderBalanceSkeletonProps {
  height?: string
  background?: string
  width?: string
  sx?: any
}

export const LoaderBalanceSkeleton: FC<LoaderBalanceSkeletonProps> = (props) => {
  const { height = '40px', background = '#ddbbdd', sx, width = '100%' } = props

  const Span = styled(Stack)`
    width: ${width};
    height: ${height};
    display: block;
    background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 80%
      ),
      ${background};
    background-repeat: repeat-y;
    background-size: 50px 200px;
    background-position: 0 0;
    animation: shine 1s infinite;

    @keyframes shine {
      0% {
        background-position: 0% 0, 0 0, 120px 0, 120px 40px, 120px 80px, 120px 120px;
      }
      100% {
        background-position: 100% 0, 0 0, 120px 0, 120px 40px, 120px 80px, 120px 120px;
      }
    }
  `

  return <Span sx={sx}></Span>
}
