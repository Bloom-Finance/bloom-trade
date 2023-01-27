import { Order } from '@bloom-trade/types'
import { Store } from 'pullstate'

interface IOrderStore {
  order: Omit<Order, 'from'>
}

export const OrderStore = new Store<IOrderStore>({
  order: {
    id: '',
    orderId: '',
    date: Date.now(),
    total: {
      amount: 0,
    },
    destination: {
      chain: 'eth',
      address: '',
      token: 'dai',
      description: {
        name: '',
        image: '',
      },
    },
  },
})
