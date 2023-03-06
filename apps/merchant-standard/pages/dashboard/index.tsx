import { Chain } from '@bloom-trade/types';
import { fCurrency } from '@bloom-trade/utilities';
import { useTheme } from '@emotion/react';
import {
  Button,
  ButtonGroup,
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { merge } from 'lodash';
import type { NextPage } from 'next';
import { useState } from 'react';
import CardsList from '../../src/components/cardsList';
import ReactApexChart, { BaseOptionChart } from '../../src/components/chart';
import Iconify from '../../src/components/Iconify';
import SecurePage from '../../src/components/layout/securedPage';
import TableComponent from '../../src/components/table';
import useResponsive from '../../src/hooks/useResponsive';
import { BalancesPerToken } from '../../src/sections/dashboard/balances';

const Page: NextPage = () => {
  const [periodFilter, setPeriodFilter] = useState<'1d' | '1w' | '1m' | '1y'>(
    '1m'
  );
  const balancePerToken = [
    {
      token: 'usdt',
      chain: 'ETH' as Chain,
      balance: '1350',
    },
    {
      token: 'dai',
      chain: 'ETH' as Chain,
      balance: '750',
    },
    ,
    {
      token: 'usdc',
      chain: 'ETH' as Chain,
      balance: '5500',
    },
  ];

  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const Actions = () => {
    return (
      <Stack spacing={2} direction='row'>
        <Button variant='outlined' size='small' color='secondary'>
          Get Payment
        </Button>
        <Button variant='contained' size='small' color='secondary'>
          Send funds
        </Button>
      </Stack>
    );
  };
  const Stats = () => {
    const chartData = [
      {
        name: 'Team A',
        type: 'column',
        fill: 'solid',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
      },
      {
        name: 'Team B',
        type: 'area',
        fill: 'gradient',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
      },
      {
        name: 'Team C',
        type: 'line',
        fill: 'solid',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
      },
    ];

    const chartOptions = merge(BaseOptionChart(), {
      plotOptions: { bar: { columnWidth: '16%' } },
      fill: { type: chartData.map((i) => i.fill) },
      labels: [
        '01/01/2003',
        '02/01/2003',
        '03/01/2003',
        '04/01/2003',
        '05/01/2003',
        '06/01/2003',
        '07/01/2003',
        '08/01/2003',
        '09/01/2003',
        '10/01/2003',
        '11/01/2003',
      ],
      xaxis: { type: 'datetime' },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (y: number) => {
            if (typeof y !== 'undefined') {
              return `${y.toFixed(0)} visits`;
            }
            return y;
          },
        },
      },
    });

    return (
      <Stack py={2}>
        <Card>
          <ReactApexChart
            type='line'
            series={chartData}
            options={chartOptions}
            height={364}
          />
        </Card>
      </Stack>
    );
  };

  const LastMovements = () => {
    const headListTransactions = [
      {
        id: 'kind',
        label: 'Kind',
        width: '10px',
      },
      {
        id: 'date',
        label: 'Date',
        width: '100px',
      },
      {
        id: 'amount',
        label: 'Amount',
        width: '30%',
      },
    ];

    const lastMovements = [
      {
        id: '1',
        kind: 'in',
        date: '2021-10-01',
        amount: '1000',
      },
      {
        id: '2',
        kind: 'out',
        date: '2021-10-01',
        amount: '1000',
      },
      {
        id: '3',
        kind: 'in',
        date: '2021-10-01',
        amount: '1000',
      },
      {
        id: '4',
        kind: 'out',
        date: '2021-10-01',
        amount: '1000',
      },
      {
        id: '4',
        kind: 'out',
        date: '2021-10-01',
        amount: '1000',
      },

      {
        id: '4',
        kind: 'out',
        date: '2021-10-01',
        amount: '1000',
      },
      {
        id: '4',
        kind: 'out',
        date: '2021-10-01',
        amount: '1000',
      },
      {
        id: '4',
        kind: 'out',
        date: '2021-10-01',
        amount: '1000',
      },
      {
        id: '4',
        kind: 'out',
        date: '2021-10-01',
        amount: '1000',
      },
      {
        id: '4',
        kind: 'out',
        date: '2021-10-01',
        amount: '1000',
      },
      {
        id: '4',
        kind: 'out',
        date: '2021-10-01',
        amount: '1000',
      },
    ];

    const parseRow = (row: any) => {
      return {
        id: row.id,
        components: [
          <Iconify
            icon={`fluent:mail-inbox-arrow-${
              row.kind === 'in' ? 'down' : 'up'
            }-20-regular`}
            fontSize={32}
            color={row.kind === 'in' ? 'green' : 'red'}
          />,
          <Stack>{row.date}</Stack>,
          <Typography variant='body2' color='text.primary'>
            {fCurrency(row.amount)}
          </Typography>,
        ],
      };
    };

    return (
      <Card>
        <TableComponent
          head={headListTransactions}
          rows={lastMovements.map(parseRow)}
          maxHeight={mdUp ? 800 : 200}
          title='Last movements'
        />
      </Card>
    );
  };

  const applyFilter = (filter: '1d' | '1w' | '1m' | '1y') => {
    setPeriodFilter(filter);
  };

  return (
    <SecurePage
      title='My Dashboard'
      subTitle='Welcome Back!!'
      currentLink='overview'
      actions={mdUp && <Actions />}
    >
      <Stack>
        <ButtonGroup variant='outlined' size='small'>
          <Button
            variant={periodFilter === '1y' ? 'contained' : 'outlined'}
            onClick={() => setPeriodFilter('1y')}
          >
            {mdUp ? '12 months' : '12m'}
          </Button>
          <Button
            variant={periodFilter === '1m' ? 'contained' : 'outlined'}
            onClick={() => setPeriodFilter('1m')}
          >
            {mdUp ? '30 days' : '30d'}
          </Button>
          <Button
            variant={periodFilter === '1w' ? 'contained' : 'outlined'}
            onClick={() => setPeriodFilter('1w')}
          >
            {mdUp ? '7 days' : '7d'}
          </Button>
          <Button
            variant={periodFilter === '1d' ? 'contained' : 'outlined'}
            onClick={() => setPeriodFilter('1d')}
          >
            {mdUp ? '24 hours' : '24h'}
          </Button>
        </ButtonGroup>
      </Stack>

      <Stack>
        <BalancesPerToken balances={balancePerToken as any} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Stats />
            <CardsList />
          </Grid>
          <Grid item xs={12} md={4}>
            <LastMovements />
          </Grid>
        </Grid>
      </Stack>
    </SecurePage>
  );
};

export default Page;
