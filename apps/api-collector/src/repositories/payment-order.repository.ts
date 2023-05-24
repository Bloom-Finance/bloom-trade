import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {PaymentOrder, PaymentOrderRelations} from '../models';

export class PaymentOrderRepository extends DefaultCrudRepository<
  PaymentOrder,
  typeof PaymentOrder.prototype._id,
  PaymentOrderRelations
> {
  constructor(
    @inject('datasources.Postgres') dataSource: PostgresDataSource,
  ) {
    super(PaymentOrder, dataSource);
  }
}
