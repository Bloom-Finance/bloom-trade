/* eslint-disable react/jsx-key */
import { Order, Testnet } from '@bloom-trade/types'
import React, { useEffect, useState } from 'react'
import PreviewComponent from './views/preview'
import { BloomStore } from '../../store/BloomReact'
import { useAccount } from 'wagmi'
import BloomServices from '@bloom-trade/services'
import CurrencySelector from './views/currencySelector'
import { formatWalletAddress, getTestnetFromMainnet } from '@bloom-trade/utilities'
import { OrderStore } from '../../store/Order'
import { Box, Button, Stack, Step, StepLabel, Stepper, Typography, useTheme } from '@mui/material'
import Sonar from '../Loaders/sonar/one-circle'
import useResponsive from '../../hooks/useResponsive'
import useBloom from '../../hooks/useBloom'
import WaitingForApproval from './views/waitingForApproval'
import WaitingForBlockchain from './views/waitingForBlockchain'
import SummaryComponent from './views/summary'
import ErrorComponent from '../Loaders/error'
import SuccessCard from './views/success'
export interface CheckoutProps {
  order?: Omit<Order, 'from'>
  type: 'payout' | 'paymentRequest'
  walletConnectButton: JSX.Element
  onFinish: () => void
}

const BloomCheckout = (props: CheckoutProps): JSX.Element => {
  const { checkChain, transfer, token } = useBloom()
  const [hasRetried, setHasRetried] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const mdUp = useResponsive('up', 'md')
  const store = BloomStore.useState((s) => s)
  const { isConnected, address } = useAccount()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [balances, setBalances] = useState<any[]>([])
  const theme = useTheme()
  const bloomServices = new BloomServices(store.credentials, {
    test: store.testnet || false,
  })
  const order = OrderStore.useState((s) => s.order)
  const cssStepsProperties = {
    '& .MuiStepLabel-root .Mui-completed': {
      color: theme.palette.primary.light,
      fontWeight: 700, // circle color (COMPLETED)
    },
    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
      color: theme.palette.primary.light, // Just text label (COMPLETED)
    },
    '& .MuiStepLabel-root .Mui-active': {
      color: theme.palette.primary.main, // circle color (ACTIVE)
    },
    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
      color: theme.palette.primary.main, // Just text label (ACTIVE)
    },
    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
      fill: 'white', // circle's number (ACTIVE)
    },
  }

  useEffect(() => {
    if (props.order) {
      OrderStore.update((s) => {
        s.order = {
          id: props.order?.id || '',
          orderId: props.order?.orderId || '',
          date: props.order?.date || Date.now(),
          total: {
            amount: props.order?.total.amount || 0,
          },
          destination: {
            chain: props.order?.destination.chain || 'eth',
            address: props.order?.destination.address || '',
            token: props.order?.destination.token || 'dai',
            description: {
              name: props.order?.destination.description?.name || '',
              image: props.order?.destination.description?.image || '',
            },
          },
        }
      })
    }
  }, [])
  useEffect(() => {
    if (activeStep === 1 && !token.waitingForUserResponse && !token.waitingForBlockchain && !token.error) {
      setActiveStep(2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token.waitingForUserResponse, token.waitingForBlockchain])
  useEffect(() => {
    if (
      activeStep === 2 &&
      !transfer.waitingForUserResponse &&
      !transfer.waitingForBlockchain &&
      !transfer.error &&
      order.from
    ) {
      transfer.prepareTransfer(
        {
          token: order.from?.token,
        },
        {
          chain: order.destination.chain,
          address: order.destination.address,
          token: order.destination.token,
        },
        order.total.amount.toString(),
      )
    }
  }, [activeStep])

  useEffect(() => {
    if (transfer.receipt) {
      setShowSuccess(true)
    }
  }, [transfer.receipt])

  const steps = [
    {
      label: !order.total.amount ? 'You are going to send USD' : `Please, Confirm send $${order.total.amount}`,
      labelCompleted: `You will send to ${formatWalletAddress(order.destination.address)} $${order.total.amount}`,
      component: (
        <PreviewComponent
          type={props.type}
          onContinue={async () => {
            //set connection
            setLoading(true)
            const balance = await bloomServices.getBalance(
              {
                dex: {
                  addresses: [address as string],
                  chains: [order.destination.chain],
                },
              },
              {
                onlyStableCoins: true,
              },
            )
            const newBalances: React.SetStateAction<any[]> = []
            balance.forEach((b) => {
              if (parseFloat(b.balance).toFixed(2).toString() !== '0.00') {
                newBalances.push({
                  amount: parseFloat(b.balance).toFixed(2),
                  currency: b.asset,
                })
              }
            })
            setBalances(newBalances)
            setLoading(false)
            setActiveStep(1)
          }}
          isConnected={isConnected}
          button={props.walletConnectButton}
        />
      ),
    },
    {
      label: 'Please, select the token you want to use',
      labelCompleted: `You choose ${order.from?.token}`,
      component: token.waitingForUserResponse ? (
        <WaitingForApproval type='tokenApproval' amount={order.total.amount} />
      ) : token.waitingForBlockchain && token.txHash ? (
        <WaitingForBlockchain
          txHash={token.txHash}
          chain={store.testnet ? (getTestnetFromMainnet(order.destination.chain) as Testnet) : order.destination.chain}
        />
      ) : token.error && !hasRetried ? (
        <ErrorComponent
          text='Error while approving token'
          onRetry={() => {
            setHasRetried(true)
            setActiveStep(0)
          }}
        />
      ) : (
        <Stack
          spacing={3}
          direction='row'
          justifyContent={'center'}
          p={mdUp ? 4 : 0}
          sx={{
            boxShadow: mdUp
              ? '0px 0px 2px rgba(145, 158, 171, 0.24), 0px 16px 32px -4px rgba(145, 158, 171, 0.24);'
              : 'none',
            borderRadius: mdUp ? '8px' : 'none',
          }}
        >
          <CurrencySelector
            amountLimit={order.total.amount.toString()}
            balances={balances}
            onApprove={() => {
              token.approve()
            }}
            onSelect={async (selectedToken) => {
              try {
                const { isChainCorrect, change, chains } = checkChain(order.destination.chain)
                if (!isChainCorrect) {
                  alert('Incorrect chain, requesting change')
                  change()
                  return false
                }
                OrderStore.update((s) => {
                  s.order = {
                    ...s.order,
                    from: {
                      token: selectedToken,
                      chain: chains.from.name,
                      address: address as string,
                    },
                  }
                })

                //Request access to token
                token.prepareApprove(
                  selectedToken,
                  chains.to.name,
                  order.total.amount.toString(),
                  selectedToken === order.destination.token ? 'transfers' : 'swapper',
                )
                return true
              } catch (error) {
                setHasRetried(false)
                return
              }
            }}
          />
        </Stack>
      ),
    },
    {
      label: 'Summary and confirmation',
      labelCompleted: 'Transaction approved',
      component: transfer.waitingForUserResponse ? (
        <WaitingForApproval type='tx' />
      ) : transfer.waitingForBlockchain && transfer.txHash ? (
        <WaitingForBlockchain
          txHash={transfer.txHash}
          chain={store.testnet ? (getTestnetFromMainnet(order.destination.chain) as Testnet) : order.destination.chain}
        />
      ) : transfer.error && !hasRetried ? (
        <ErrorComponent
          text='Error while processing tx'
          onRetry={() => {
            setActiveStep(0)
          }}
        />
      ) : showSuccess ? (
        <SuccessCard
          onContinue={() => {
            setShowSuccess(false)
          }}
          txHash={transfer?.txHash}
        />
      ) : (
        <SummaryComponent
          order={order}
          actions={{
            button: (
              <Button
                variant='contained'
                onClick={() => {
                  transfer.transfer()
                }}
              >
                Pay
              </Button>
            ),
          }}
        />
      ),
    },
  ]
  const getStepper = () => {
    return (
      <>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label} sx={cssStepsProperties}>
              <StepLabel optional={index === 3 ? <Typography variant='caption'>Last step</Typography> : null}>
                {index >= activeStep ? step.label : step.labelCompleted}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </>
    )
  }

  return (
    <>
      <Box sx={{ maxWidth: '100%' }}>
        {getStepper()}
        {loading ? (
          <Stack direction={'column'} justifyContent={'center'} alignContent='center' alignItems={'center'}>
            <Sonar color='#F82A91' />
          </Stack>
        ) : (
          <Stack pt={3}>{steps[activeStep].component}</Stack>
        )}
      </Box>
    </>
  )
}

export default BloomCheckout
