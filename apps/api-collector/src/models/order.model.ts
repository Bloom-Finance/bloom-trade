import {Entity, model, property} from '@loopback/repository';
import {customAlphabet} from 'nanoid';

@model({
  settings: {postgresql: {schema: 'public', table: 'orders'}},
})
export class Order extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  _id?: number;

  @property({
    type: 'string',
    default: () => {
      return customAlphabet('1234567890abcdef', 10)();
    },
  })
  uid: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'number',
    default: () => {
      return Date.now();
    },
  })
  iat?: number;

  @property({
    type: 'array',
    itemType: 'object',
  })
  destination?: object[];

  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
              },
              amount: {
                type: 'number',
              },
            },
          },
        },
        taxes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
              },
              amount: {
                type: 'number',
              },
            },
          },
        },
        amount: {
          type: 'number',
        },
      },
    },
  })
  total: object;

  @property({
    type: 'object',
  })
  from?: object;

  @property({
    type: 'string',
    required: true,
    default: 'pending',
  })
  status: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type PaymentOrderWithRelations = Order & OrderRelations;
