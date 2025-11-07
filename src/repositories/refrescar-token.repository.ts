import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {RefrescarToken, RefrescarTokenRelations} from '../models';

export class RefrescarTokenRepository extends DefaultCrudRepository<
  RefrescarToken,
  typeof RefrescarToken.prototype.id,
  RefrescarTokenRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(RefrescarToken, dataSource);
  }
}
