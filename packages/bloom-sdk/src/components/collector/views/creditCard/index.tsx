import React, { useEffect, useState } from 'react'
import { useStripe, useElements } from '@stripe/react-stripe-js'
interface Props {
  onContinue: () => void
  stripeCredentials: {
    apiKey: string
    secret: string
  }
}

const CreditCard = (props: Props): JSX.Element => {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (!stripe) return
  })
  return <div>Alive</div>
}

export default CreditCard
