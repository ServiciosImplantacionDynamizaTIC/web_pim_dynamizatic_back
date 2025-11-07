import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {LogExportacion, LogExportacionRelations} from '../models/log-exportacion.model';

export class LogExportacionRepository extends DefaultCrudRepository<
  LogExportacion,
  typeof LogExportacion.prototype.id,
  LogExportacionRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(LogExportacion, dataSource);
  }
}
