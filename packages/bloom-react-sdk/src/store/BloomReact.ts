import { Store } from 'pullstate'

interface IBloomStore {
  credentials: string
  url: string
  testnet: boolean
}

export const BloomStore = new Store<IBloomStore>({
  credentials: '',
  url: '',
  testnet: false,
})
