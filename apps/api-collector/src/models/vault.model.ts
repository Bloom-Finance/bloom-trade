import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Vault extends Entity {
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
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  chain: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Vault>) {
    super(data);
  }
}

export interface VaultRelations {
  // describe navigational properties here
}

export type VaultWithRelations = Vault & VaultRelations;
