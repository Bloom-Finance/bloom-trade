import styled from '@emotion/styled'
import React, { FC } from 'react'

export interface LoaderBalanceSkeletonProps {
  children?: React.ReactNode
}

export const LoaderBalanceSkeleton: FC<LoaderBalanceSkeletonProps> = (props) => {
  const Span = styled.span`
    width: 100%;
    height: 40px;
    display: block;
    background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 80%
      ),
      #dddbdd;
    background-repeat: repeat-y;
    background-size: 50px 200px;
    background-position: 0 0;
    animation: shine 2s infinite;

    @keyframes shine {
      to {
        background-position: 100% 0;
      }
    }
  `
  return <Span></Span>
}
