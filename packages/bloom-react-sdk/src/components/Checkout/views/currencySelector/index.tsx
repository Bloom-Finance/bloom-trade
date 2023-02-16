import { StableCoin } from '@bloom-trade/types'
import {
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  Stack,
  Typography,
  useTheme,
  Card,
  Button,
} from '@mui/material'
import React from 'react'
import { getTokenDescriptionBySymbol, getTokenIconBySymbol } from '@bloom-trade/utilities'
import useResponsive from '../../../../hooks/useResponsive'
import NoCreditsSVG from '../../../../assets/no_credits'

export interface CurrencySelectorProps {
  amountLimit?: string
  balances: {
    currency: StableCoin
    amount: string
  }[]
  onSelect: (selectedToken: StableCoin) => Promise<boolean | void>
  onApprove: () => void
}

const CurrencySelectorComponent = (props: CurrencySelectorProps): JSX.Element => {
  const { amountLimit } = props
  const [selectedToken, setSelectedToken] = React.useState<StableCoin | undefined>(undefined)
  const mdUp = useResponsive('up', 'md')
  const theme = useTheme()

  if (props.balances.length === 0)
    return (
      <Stack direction={'column'} justifyContent='center' alignItems={'center'} spacing={3}>
        <NoCreditsSVG />
        <Stack>
          <Typography
            align='center'
            variant='subtitle1'
            sx={{
              color: theme.palette.text.secondary,
            }}
          >{`Sorry, but you don't have available tokens to complete the payment`}</Typography>
        </Stack>
      </Stack>
    )
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: mdUp ? '600px' : '340px',
      }}
    >
      {props.balances.length > 0 ? (
        <>
          {props.balances.map((balance) => {
            return (
              <Card
                key={balance.currency}
                sx={{
                  my: 2,
                }}
              >
                <ListItem
                  secondaryAction={`$ ${balance.amount}`}
                  onClick={async () => {
                    if (!amountLimit || Number(amountLimit) <= Number(balance.amount)) {
                      const shouldSetToken = await props.onSelect(balance.currency)
                      if (shouldSetToken) setSelectedToken(balance.currency)
                    }
                  }}
                  sx={{
                    background:
                      amountLimit && Number(amountLimit) > Number(balance.amount) ? 'rgba(162, 0, 29, 0.2)' : 'none',
                  }}
                >
                  <ListItemIcon>
                    <Avatar src={getTokenIconBySymbol(balance.currency)} alt={balance.currency} />
                  </ListItemIcon>
                  <ListItemText
                    primary={balance.currency.toUpperCase()}
                    secondary={getTokenDescriptionBySymbol(balance.currency)}
                  />
                </ListItem>
              </Card>
            )
          })}
          <Button
            disabled={!selectedToken}
            variant='contained'
            onClick={() => {
              selectedToken && props.onApprove()
            }}
          >
            Approve {selectedToken?.toUpperCase()}
          </Button>
        </>
      ) : (
        <Stack sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant='h6'>No balances</Typography>
        </Stack>
      )}
    </List>
  )
}

export default CurrencySelectorComponent
