import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PaymentOrder extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  _id?: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'number',
  })
  iat?: number;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PaymentOrder>) {
    super(data);
  }
}

export interface PaymentOrderRelations {
  // describe navigational properties here
}

export type PaymentOrderWithRelations = PaymentOrder & PaymentOrderRelations;
