import React from 'react'
import { StoryFn, ComponentStory, ComponentMeta } from '@storybook/react'
import { Stack } from '@mui/system'
import { Box, Button, MobileStepper, Paper, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material'
import useResponsive from '../../../../hooks/useResponsive'
import PreviewComponent from '../preview'
import WaitingForApproval from '../waitingForApproval'
import { currencyBalancesData } from './currencySelector.stories'
import CurrencySelectorComponent from '../currencySelector'
import WaitingForBlockchain from '../waitingForBlockchain'
import { Chain, StableCoin } from '@bloom-trade/types'

interface MyTemplatePageProps {
  title: string
  activeStep: number
  isConnected: boolean
  amountLimit: string
}

const MyTemplatePage = (props: MyTemplatePageProps) => {
  const mdUp = useResponsive('up', 'md')
  const { activeStep, isConnected, amountLimit } = props
  const [currencySelected, setCurrencySelected] = React.useState(null)

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

  const steps = [
    {
      label: 'Please, Confirm send USD 1,500',
      labelCompleted: 'You will send to 0x123445 USD 1,500',
      component: <PreviewComponent {...previewInfo} />,
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
    onSelect: (currency: any) => setCurrencySelected(currency),
  }

  if (!mdUp)
    return (
      <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 50,
            pl: 2,
            bgcolor: 'background.default',
          }}
        >
          <Typography>{steps[activeStep].label}</Typography>
        </Paper>

        <MobileStepper
          variant='dots'
          steps={steps.length}
          position='static'
          activeStep={activeStep}
          backButton={undefined}
          nextButton={undefined}
        />
        <Stack pt={3}>
          {activeStep === 0 && <PreviewComponent {...previewInfo} />}
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
          {activeStep === 1 && currencySelected && <WaitingForApproval status='pending' type='tokenApproval' />}
          {activeStep === 2 && <WaitingForBlockchain status='pending' />}
          {activeStep === 3 && <div>Success --- TODO</div>}
        </Stack>
      </Box>
    )

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{index >= activeStep ? step.label : step.labelCompleted}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stack pt={3}>
        {activeStep === 0 && <PreviewComponent {...previewInfo} />}
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
        {activeStep === 1 && currencySelected && <WaitingForApproval status='pending' type='tokenApproval' />}
        {activeStep === 2 && <WaitingForBlockchain status='pending' />}
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
