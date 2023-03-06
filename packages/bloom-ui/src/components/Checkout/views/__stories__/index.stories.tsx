import React from 'react'
import { StoryFn, ComponentMeta } from '@storybook/react'
import { Stack } from '@mui/system'
import { Box, Button, Paper, Step, StepContent, StepLabel, Stepper, Typography, useTheme } from '@mui/material'
import useResponsive from '../../../../hooks/useResponsive'
import PreviewComponent from '../preview'
import WaitingForApproval from '../waitingForApproval'
import { currencyBalancesData } from './currencySelector.stories'
import CurrencySelectorComponent from '../currencySelector'
import WaitingForBlockchain from '../waitingForBlockchain'
import { Chain, StableCoin } from '@bloom-trade/types'

export interface MyTemplatePageProps {
  title: string
  activeStep: number
  isConnected: boolean
  amountLimit: string
}

export const MyTemplatePage = (props: MyTemplatePageProps) => {
  const mdUp = useResponsive('up', 'md')
  const { activeStep, isConnected, amountLimit } = props
  const [currencySelected, setCurrencySelected] = React.useState(null)
  const theme = useTheme()
  const previewInfo = {
    token: 'dai' as StableCoin,
    chain: 'eth' as Chain,
    address: '0x123445',
    isConnected,
    orderId: '4f90d13a42',
    date: 1674568125845,
    total: {
      details: {
        items: [{ description: 'Flight for 1 person', amount: 150 }],
        taxes: [{ description: 'Tax', amount: 100 }],
      },
      amount: 250,
    },
    button: <Button variant='contained'>Connect</Button>,
    from: {
      chain: 'avax' as any,
      address: '0x123445',
      token: 'usdt' as any,
    },
  }

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
  const steps = [
    {
      label: 'Please, Confirm send USD 1,500',
      labelCompleted: 'You will send to 0x123445 USD 1,500',
      component: <PreviewComponent type='payout' {...previewInfo} />,
    },
    {
      label: 'Please, select token do you want to use',
      labelCompleted: 'Token Selected',
      component: <div>To complete</div>,
    },
    {
      label: 'Grant access to yours DAI',
      labelCompleted: 'Access granted',
      component: <div>To complete</div>,
    },
    {
      label: 'Approve transaction',
      labelCompleted: 'Transaction approved',
      component: <div>To complete</div>,
    },
  ]

  const _currencySelectorData = {
    ...currencyBalancesData,
    amountLimit,
    onAprove: () => {
      console.log('approved')
    },
    onSelect: async (currency: any) => {
      setCurrencySelected(currency)
      return true
    },
  }

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label} sx={cssStepsProperties}>
            <StepLabel optional={index === 3 ? <Typography variant='caption'>Last step</Typography> : null}>
              {index >= activeStep ? step.label : step.labelCompleted}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stack pt={3}>
        {activeStep === 0 && <PreviewComponent type='payout' {...previewInfo} />}
        {activeStep === 1 && !currencySelected && (
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
            <CurrencySelectorComponent {..._currencySelectorData} />{' '}
          </Stack>
        )}
        {activeStep === 1 && currencySelected && <WaitingForApproval type='tokenApproval' />}
        {activeStep === 2 && (
          <WaitingForBlockchain
            txHash='0x6e9286dd5957142b0deb0ae1cabcc15d07384c7dd4a57e2d56369a865b347453'
            chain='goerli'
          />
        )}
        {activeStep === 3 && <div>Success --- TODO</div>}
      </Stack>
    </Box>
  )
}
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Template/Checkout',
  component: MyTemplatePage,
  args: {
    activeStep: 0,
    isConnected: false,
    amountLimit: '1000',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof MyTemplatePage>

export const Main: StoryFn<MyTemplatePageProps> = (args) => {
  return <MyTemplatePage {...args} />
}
