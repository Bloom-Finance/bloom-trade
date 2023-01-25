import { Store } from 'pullstate'

interface IBloomStore {
  apiKey: string
  url: string
  testnet: boolean
}

export const BloomStore = new Store<IBloomStore>({
  apiKey: '',
  url: '',
  testnet: false,
})
