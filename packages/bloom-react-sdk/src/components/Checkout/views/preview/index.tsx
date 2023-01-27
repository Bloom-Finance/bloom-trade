import {
  Avatar,
  Button,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getTokenIconBySymbol, isWeb3WalletByAddress } from '@bloom-trade/utilities'
import { Chain, StableCoin } from '@bloom-trade/types'
import useResponsive from '../../../../hooks/useResponsive'
import { OrderStore } from '../../../../store/Order'
export interface PreviewProps {
  onContinue?: () => void
  button?: JSX.Element
  isConnected?: boolean
}

const PreviewComponent = (props: PreviewProps): JSX.Element => {
  const [hasMounted, setHasMounted] = useState(false)
  const order = OrderStore.useState((s) => s.order)
  const [tokenSelected, setTokenSelectd] = useState(order.destination.token)
  const theme = useTheme()
  const { isConnected } = props
  const mdUp = useResponsive('up', 'md')
  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <Stack
      spacing={3}
      p={mdUp ? 4 : 0}
      sx={{
        boxShadow: mdUp
          ? '0px 0px 2px rgba(145, 158, 171, 0.24), 0px 16px 32px -4px rgba(145, 158, 171, 0.24);'
          : 'none',
        borderRadius: mdUp ? '8px' : 'none',
      }}
    >
      <Stack>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <Stack direction='row' alignItems={'center'} justifyContent={!mdUp ? 'center' : 'left'}>
              <ImageAvatar />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Stack
              py={4}
              direction={'row'}
              alignItems={'center'}
              sx={{
                height: '100%',
              }}
            >
              <Typography
                variant='body1'
                align={mdUp ? 'left' : 'center'}
                gutterBottom
                sx={{
                  color: 'text.secondary',
                  fontWeight: mdUp ? 'bold' : 'normal',
                }}
              >
                Please, fill the information below to send your payment or choose from your
                <Typography variant='body1' component='span' px={1} fontWeight='bold'>
                  Address Book
                </Typography>
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <Stack pt={mdUp ? 2 : 0}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              id='displayName'
              label='Name or Display Name'
              value={order.destination.description?.name}
              onChange={(e) => {
                OrderStore.update((s) => {
                  s.order = {
                    ...s.order,
                    destination: {
                      ...s.order.destination,
                      description: {
                        ...s.order.destination.description,
                        name: e.target.value,
                      },
                    },
                  }
                })
              }}
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              id='wallet-address'
              onChange={(e) => {
                OrderStore.update((s) => {
                  s.order = {
                    ...s.order,
                    destination: {
                      ...s.order.destination,
                      address: e.target.value,
                    },
                  }
                })
              }}
              label='Address'
              variant='outlined'
              fullWidth
              value={order.destination.address}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Select
              value={order.destination.chain}
              onChange={(e) => {
                OrderStore.update((s) => {
                  s.order = {
                    ...s.order,
                    destination: {
                      ...s.order.destination,
                      chain: e.target.value as Chain,
                    },
                  }
                })
              }}
            >
              <MenuItem value='eth'>Ethereum</MenuItem>
              <MenuItem value='polygon'>Polygon</MenuItem>
              <MenuItem value='avax'>Avalanche</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Stack spacing={2} direction='row' justifyContent={'space-around'}>
              <ToggleButtonGroup
                value={tokenSelected}
                exclusive
                onChange={(_, value) => {
                  OrderStore.update((s) => {
                    s.order = {
                      ...s.order,
                      destination: {
                        ...s.order.destination,
                        token: value as StableCoin,
                      },
                    }
                  })
                  setTokenSelectd(value)
                }}
              >
                <ToggleButton value='usdt'>
                  <Avatar src={getTokenIconBySymbol('usdt')} alt={'usdt'} />
                </ToggleButton>
                <ToggleButton value='usdc'>
                  <Avatar src={getTokenIconBySymbol('usdc')} alt={'usdc'} />
                </ToggleButton>
                <ToggleButton value='dai'>
                  <Avatar src={getTokenIconBySymbol('dai')} alt={'dai'} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3}>
            {hasMounted && !isConnected ? (
              <Stack>{props.button}</Stack>
            ) : (
              <Button
                disabled={order.destination.address === '' || !isWeb3WalletByAddress(order.destination.address)}
                onClick={() => {
                  if (props.onContinue) props.onContinue()
                }}
                variant='contained'
                fullWidth
              >
                Continue
              </Button>
            )}
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  )
}
export default PreviewComponent

const ImageAvatar = () => {
  return (
    <svg width='158' height='115' viewBox='0 0 158 115' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M74.4979 113.915C102.498 113.915 125.198 91.2154 125.198 63.1154C125.198 35.0154 102.498 12.3154 74.4979 12.3154C46.4979 12.3154 23.7979 35.0154 23.7979 63.1154C23.7979 91.2154 46.4979 113.915 74.4979 113.915Z'
        fill='#F1F3F9'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M83.9357 43.0824C83.9357 50.4306 77.9932 56.3731 70.5811 56.3731C70.4533 56.3731 69.367 56.3731 61.3798 56.3731C55.8206 56.3731 46.9388 56.3731 32.7535 56.3731H25.9803C17.0985 56.5648 10.0059 49.4722 10.0059 40.9099C10.0059 32.2836 17.1624 25.1271 26.172 25.5744C33.9037 1.42098 69.3031 4.80757 72.3063 29.7916C78.9517 30.6223 83.9357 36.2453 83.9357 43.0824Z'
        fill='white'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M72.1144 29.8559C71.6032 29.792 71.092 29.792 70.5808 29.792C67.961 29.792 65.469 30.5588 63.3604 31.9006'
        fill='white'
      />
      <path
        d='M72.1144 29.8559C71.6032 29.792 71.092 29.792 70.5808 29.792C67.961 29.792 65.469 30.5588 63.3604 31.9006'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
      />
      <path
        d='M26.1716 25.5742C25.4049 27.8745 25.0215 30.3027 25.0215 32.8586C25.0215 33.8809 25.0854 34.8394 25.2132 35.7979'
        fill='white'
      />
      <path
        d='M26.1716 25.5742C25.4049 27.8745 25.0215 30.3027 25.0215 32.8586C25.0215 33.8809 25.0854 34.8394 25.2132 35.7979'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M156.694 78.6357C156.694 86.8055 150.087 93.4125 141.846 93.4125C141.704 93.4125 140.497 93.4125 131.616 93.4125C125.436 93.4125 115.561 93.4125 99.7892 93.4125H92.2587C82.3838 93.6256 74.498 85.7399 74.498 76.2202C74.498 66.6295 82.4548 58.6727 92.4718 59.17C101.068 32.316 140.425 36.0812 143.764 63.8588C151.153 64.7824 156.694 71.0341 156.694 78.6357Z'
        fill='white'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M143.551 63.9304C142.983 63.8594 142.415 63.8594 141.846 63.8594C138.933 63.8594 136.163 64.7119 133.818 66.2038'
        fill='white'
      />
      <path
        d='M143.551 63.9304C142.983 63.8594 142.415 63.8594 141.846 63.8594C138.933 63.8594 136.163 64.7119 133.818 66.2038'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
      />
      <path
        d='M92.4721 59.1699C91.6196 61.7275 91.1934 64.4271 91.1934 67.2688C91.1934 68.4054 91.2644 69.4711 91.4065 70.5367'
        fill='white'
      />
      <path
        d='M92.4721 59.1699C91.6196 61.7275 91.1934 64.4271 91.1934 67.2688C91.1934 68.4054 91.2644 69.4711 91.4065 70.5367'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M70.7721 95.8008C70.7721 100.168 67.2405 103.699 62.8355 103.699C62.7596 103.699 62.114 103.699 57.3672 103.699C54.0635 103.699 48.785 103.699 40.3548 103.699H36.3295C31.0511 103.813 26.8359 99.5982 26.8359 94.5097C26.8359 89.3831 31.0891 85.13 36.4434 85.3958C41.0383 71.0416 62.076 73.0542 63.8608 87.9021C67.8101 88.3958 70.7721 91.7375 70.7721 95.8008Z'
        fill='white'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M63.7464 87.9403C63.4426 87.9023 63.1388 87.9023 62.835 87.9023C61.2781 87.9023 59.7971 88.358 58.5439 89.1555'
        fill='white'
      />
      <path
        d='M63.7464 87.9403C63.4426 87.9023 63.1388 87.9023 62.835 87.9023C61.2781 87.9023 59.7971 88.358 58.5439 89.1555'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
      />
      <path
        d='M36.4433 85.3955C35.9876 86.7626 35.7598 88.2056 35.7598 89.7246C35.7598 90.3322 35.7977 90.9018 35.8737 91.4714'
        fill='white'
      />
      <path
        d='M36.4433 85.3955C35.9876 86.7626 35.7598 88.2056 35.7598 89.7246C35.7598 90.3322 35.7977 90.9018 35.8737 91.4714'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M70.8561 44.0546L64.2612 49.3702C63.0315 50.2874 61.4258 49.6337 61.0497 48.0628L58.8482 32.8115'
        fill='#D6DCE8'
      />
      <path
        d='M133.884 5.50775L129.646 9.42858L85.2993 50.7702C83.2785 52.7071 80.1533 52.6248 78.0697 50.8398L62.1376 36.1764L58.9417 33.2044L50.1297 24.9334C48.242 23.1015 49.1035 19.7812 51.6961 19.3682L124.586 7.31806L133.884 5.50775Z'
        fill='#F1F3F9'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M133.884 5.50791L129.647 9.42873L62.2866 35.9333L58.8949 33.0082L124.735 7.07498L133.884 5.50791Z'
        fill='#D6DCE8'
      />
      <path
        d='M11.0907 88.7678L8.26651 91.172C7.73904 91.588 7.02851 91.3207 6.84546 90.6375L5.70256 83.9877'
        fill='#D6DCE8'
      />
      <path
        d='M38.226 71.1539L36.4174 72.9199L17.492 91.537C16.6302 92.4086 15.2613 92.4093 14.3283 91.6525L7.18225 85.4214L5.74846 84.158L1.79409 80.6413C0.946275 79.8616 1.28433 78.3982 2.41429 78.1869L34.1778 72.0556L38.226 71.1539Z'
        fill='#F1F3F9'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M38.2262 71.1544L36.4175 72.9204L7.24465 85.3136L5.7257 84.0731L34.2402 71.9478L38.2262 71.1544Z'
        fill='#D6DCE8'
      />
      <path
        d='M66.1145 99.2715L60.9434 103.674C59.9775 104.435 58.6766 103.946 58.3414 102.695L56.2487 90.5191'
        fill='#D6DCE8'
      />
      <path
        d='M115.799 67.0206L112.488 70.2542L77.8348 104.342C76.2569 105.938 73.7504 105.939 72.0421 104.554L58.9575 93.1444L56.3322 90.8313L49.0917 84.392C47.5393 82.9645 48.1583 80.2849 50.2273 79.8981L108.387 68.6716L115.799 67.0206Z'
        fill='#F1F3F9'
        stroke='#D6DCE8'
        strokeWidth='2'
        strokeMiterlimit='10'
      />
      <path
        d='M115.799 67.021L112.487 70.2546L59.0715 92.9467L56.2903 90.6754L108.501 68.4738L115.799 67.021Z'
        fill='#D6DCE8'
      />
    </svg>
  )
}

/* 
<Card>
      <CardContent>
        <Stack>
          {props.destinationDescription && (
            <Stack direction={'row'} alignItems={'center'}>
              <Avatar src={props.destinationDescription.image}></Avatar>
              <Typography variant='body2'>{props.destinationDescription.name}</Typography>
            </Stack>
          )}
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant='caption'>Order #{props.orderId}</Typography>
          <Typography variant='caption'>{fDate(props.date, 'L')}</Typography>
        </Stack>
        {props.from && (
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography variant='body2'>You will pay with</Typography>
            <Typography variant='body2'>{props.from.token.toUpperCase()}</Typography>
          </Stack>
        )}
        {props.total.details && (
          <Stack direction={'column'} justifyContent={'space-between'}>
            {props.total.details.items &&
              props.total.details.items.map((item) => {
                return (
                  <Stack key={item.description} direction={'row'} justifyContent={'space-between'}>
                    <Typography variant='body2'>{item.description}</Typography>
                    <Typography variant='body2'>${item.amount}</Typography>
                  </Stack>
                )
              })}
            {props.total.details.taxes &&
              props.total.details.taxes.map((tax) => {
                return (
                  <Stack key={tax.description} direction={'row'} justifyContent={'space-between'}>
                    <Typography variant='body2'>{tax.description}</Typography>
                    <Typography variant='body2'>${tax.amount}</Typography>
                  </Stack>
                )
              })}
          </Stack>
        )}
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant='body2'>Total</Typography>
          <Typography variant='body2'>${props.total.amount}</Typography>
        </Stack>
      </CardContent>
      {hasMounted ? <CardActions>{props.button}</CardActions> : 'Loading...'}
    </Card>
*/
