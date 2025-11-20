import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {LogAccion, LogAccionRelations} from '../models/log-accion.model';

export class LogAccionRepository extends DefaultCrudRepository<
  LogAccion,
  typeof LogAccion.prototype.id,
  LogAccionRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(LogAccion, dataSource);
  }
}
