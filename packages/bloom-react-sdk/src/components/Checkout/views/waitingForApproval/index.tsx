/* eslint-disable react/jsx-key */
import React from 'react'
export interface Props {
  status: 'approved' | 'pending' | 'rejected'
  type: 'tokenApproval' | 'tx'
}

const WaitingForApproval = (props: Props): JSX.Element => {
  console.log(props)
  return <div>test</div>
}

export default WaitingForApproval
