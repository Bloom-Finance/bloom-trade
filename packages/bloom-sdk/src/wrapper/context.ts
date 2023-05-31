import React from 'react'

export const SDKContext = React.createContext<{
  test: boolean
  apiUrl: string
}>({
  test: false,
  apiUrl: '',
})
