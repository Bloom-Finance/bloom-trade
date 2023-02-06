import { Order } from '@bloom-trade/types';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import withPreCheckOrder from '../src/controls/hoc/Order/index';
import { BloomReact, Checkout, useBloom } from '@bloom-trade/react-sdk';
import { authService } from '../src/services/auth.services';
interface Props {
  order: Order;
}
const Page: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { Connect } = useBloom();
  return (
    <BloomReact
      credentials={authService.getToken() as string}
      useTestnet={true}
    >
      <Checkout
        type='paymentRequest'
        onFinish={() => {
          console.log('done');
        }}
        order={props.order}
        walletConnectButton={<Connect />}
      />
    </BloomReact>
  );
};

export default withPreCheckOrder(Page);
