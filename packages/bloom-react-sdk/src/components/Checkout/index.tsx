/* eslint-disable react/jsx-key */
import { Chain, Order, Testnet } from '@bloom-trade/types'
import React, { useEffect, useState } from 'react'
import PreviewComponent from './views/preview'
import { BloomStore } from '../../store/BloomReact'
import { useAccount, useSwitchNetwork } from 'wagmi'
import BloomServices from '@bloom-trade/services'
import CurrencySelector from './views/currencySelector'
import { useWeb3ModalNetwork } from '@web3modal/react'
import { getChainIdByName, formatWalletAddress, getTestnetFromMainnet, getChainNameById } from '@bloom-trade/utilities'
import { OrderStore } from '../../store/Order'
import { Box, Stack, Step, StepLabel, Stepper, Typography, useTheme } from '@mui/material'
import Sonar from '../Loaders/sonar/one-circle'
import useResponsive from '../../hooks/useResponsive'
import useBloom from '../../hooks/useBloom'
import WaitingForApproval from './views/waitingForApproval'
export interface CheckoutProps {
  order?: Omit<Order, 'from'>
  walletConnectButton: JSX.Element
}

const BloomCheckout = (props: CheckoutProps): JSX.Element => {
  const { RequestTokenAccess, waitingForUserResponse, waitingForBlockchain } = useBloom()
  const mdUp = useResponsive('up', 'md')
  const store = BloomStore.useState((s) => s)
  const { isConnected, address } = useAccount()
  const [activeStep, setActiveStep] = useState(0)
  const { switchNetwork } = useSwitchNetwork()
  const [loading, setLoading] = useState(false)
  const [balances, setBalances] = useState<any[]>([])
  const theme = useTheme()
  const bloomServices = new BloomServices(store.apiKey, {
    test: store.testnet || false,
  })
  const order = OrderStore.useState((s) => s.order)
  const { selectedChain } = useWeb3ModalNetwork()
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
    if (activeStep === 1 && !waitingForUserResponse) {
      setActiveStep(2)
    }
  }, [waitingForUserResponse])
  const steps = [
    {
      label: !order.total.amount ? 'You are going to send USD' : `Please, Confirm send $${order.total.amount}`,
      labelCompleted: `You will send to ${formatWalletAddress(order.destination.address)} $${order.total.amount}`,
      component: (
        <PreviewComponent
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
      labelCompleted: `You chose ${order.from?.token}`,
      component: waitingForUserResponse ? (
        <WaitingForApproval type='tokenApproval' amount={order.total.amount} />
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
            onSelect={async (selectedToken) => {
              if (!selectedChain) throw new Error('Chain not supported')
              const sourceChainId = selectedChain.id
              const destinationChainName = store.testnet
                ? (getTestnetFromMainnet(order.destination.chain) as Chain | Testnet)
                : order.destination.chain
              const destinationChainId = getChainIdByName(destinationChainName)
              if (!sourceChainId || !destinationChainId || !switchNetwork) {
                throw new Error('Chain not supported')
              }
              if (sourceChainId !== destinationChainId) {
                switchNetwork(destinationChainId)
              }
              OrderStore.update((s) => {
                s.order = {
                  ...s.order,
                  from: {
                    token: selectedToken,
                    chain: getChainNameById(sourceChainId) as Chain,
                    address: address as string,
                  },
                }
              })
              //Request access to token
              await RequestTokenAccess(
                selectedToken,
                destinationChainName,
                order.total.amount.toString(),
                selectedToken === order.destination.token ? 'transfers' : 'swapper',
              )
            }}
          />
        </Stack>
      ),
    },
    {
      label: 'Approve transaction',
      labelCompleted: 'Transaction approved',
      component: <div>To complete</div>,
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
