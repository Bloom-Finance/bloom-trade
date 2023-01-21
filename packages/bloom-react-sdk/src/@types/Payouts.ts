import { Chain, Stablecoin } from './GLOBAL'

export interface Payout {
  destination: Destination
  emitter: Emitter
  amount: number
  status: Status
}

export type Destination = {
  name?: string
  address: string
  chain: Chain
  token: Stablecoin
}

export type Emitter = {
  name?: string
  address: string
  chain: Chain
  token: Stablecoin
}

export enum PayoutStatuses {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export type Status = PayoutStatuses.PENDING | PayoutStatuses.COMPLETED | PayoutStatuses.FAILED
