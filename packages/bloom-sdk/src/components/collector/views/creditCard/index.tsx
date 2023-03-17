import React, { useEffect, useState } from 'react'
import { useStripe, useElements, LinkAuthenticationElement, PaymentElement } from '@stripe/react-stripe-js'
import { PaymentIntent, StripePaymentElementOptions } from '@stripe/stripe-js'
interface Props {
  onSuccess: (payment: PaymentIntent) => void
  onError?: (error: string) => void
  clientSecret: string
}

const CreditCard = (props: Props): JSX.Element => {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (!stripe) return
    if (!props.clientSecret) return
    stripe.retrievePaymentIntent(props.clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!')
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.')
          break
        default:
          setMessage('Something went wrong.')
          break
      }
    })
  }, [stripe])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsLoading(true)
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/success',
      },
      redirect: 'if_required',
    })
    if ((error && error.type === 'card_error') || (error && error.type === 'validation_error')) {
      props.onError && props.onError(error.message || error.type)
      setMessage(error.message)
    }
    props.onSuccess(paymentIntent as PaymentIntent)
    setIsLoading(false)
  }
  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
  }
  return (
    <form id='payment-form' onSubmit={handleSubmit}>
      <LinkAuthenticationElement id='link-authentication-element' onChange={(e) => setEmail(e.value.email)} />
      <PaymentElement id='payment-element' options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id='submit'>
        <span id='button-text'>{isLoading ? <div className='spinner' id='spinner'></div> : 'Pay now'}</span>
      </button>
    </form>
  )
}

export default CreditCard
