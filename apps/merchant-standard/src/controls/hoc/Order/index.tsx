import { Order } from '@bloom-trade/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FindLoader } from '@bloom-trade/react-sdk';
const withPreCheckOrder = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const PreFetch = (props: any) => {
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState<Order>();
    const router = useRouter();
    const {
      query: { order },
    } = router;
    useEffect(() => {
      (async () => {
        if (!order) return;
        const { data } = await axios.get<{ isValid: boolean; payload: Order }>(
          `/api/verifyToken?bloom=true`,
          {
            headers: {
              Authorization: `Bearer ${order}`,
            },
          }
        );
        if (data.isValid) {
          setOrderData(data.payload);
          setLoading(false);
        } else {
          setLoading(false);
          router.push('/404');
        }
      })();
    }, [order]);
    return loading ? (
      <FindLoader color='#F82A9' />
    ) : (
      <Component order={orderData} {...props} />
    );
  };

  return PreFetch;
};

export default withPreCheckOrder;
