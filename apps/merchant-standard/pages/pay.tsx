import { Order } from '@bloom-trade/types';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import withPreCheckOrder from '../src/controls/hoc/Order/index';
import { Checkout, useBloom } from '@bloom-trade/react-sdk';
interface Props {
  order: Order;
}
const Page: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { Connect } = useBloom();
  return (
    <div>
      <Checkout
        type='paymentRequest'
        onFinish={() => {
          console.log('done');
        }}
        order={props.order}
        walletConnectButton={<Connect />}
      />
    </div>
  );
};

export default withPreCheckOrder(Page);
