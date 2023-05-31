import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Order, OrderRelations} from '../models';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype._id,
  OrderRelations
> {
  constructor(@inject('datasources.Postgres') dataSource: PostgresDataSource) {
    super(Order, dataSource);
  }
}
