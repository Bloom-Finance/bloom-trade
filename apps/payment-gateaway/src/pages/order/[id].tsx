import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Collector } from '@bloom-trade/sdk';
const OrderPayment: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Collector
      orderId={id as string}
      onError={(err) => {}}
      onSuccess={(receipt) => {
        console.log(receipt);
      }}
    />
  );
};

export default OrderPayment;
