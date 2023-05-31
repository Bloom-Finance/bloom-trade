import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Vault, VaultRelations} from '../models';

export class VaultRepository extends DefaultCrudRepository<
  Vault,
  typeof Vault.prototype._id,
  VaultRelations
> {
  constructor(@inject('datasources.Postgres') dataSource: PostgresDataSource) {
    super(Vault, dataSource);
  }
}
