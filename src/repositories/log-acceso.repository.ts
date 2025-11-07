import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {LogAcceso, LogAccesoRelations} from '../models';

export class LogAccesoRepository extends DefaultCrudRepository<
  LogAcceso,
  typeof LogAcceso.prototype.id,
  LogAccesoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(LogAcceso, dataSource);
  }
}
