import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { ApiBackendDataSource } from '../datasources';
import { ConfiguracionLimpiezaLogs, ConfiguracionLimpiezaLogsRelations } from '../models';

export class ConfiguracionLimpiezaLogsRepository extends DefaultCrudRepository<
  ConfiguracionLimpiezaLogs,
  typeof ConfiguracionLimpiezaLogs.prototype.id,
  ConfiguracionLimpiezaLogsRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(ConfiguracionLimpiezaLogs, dataSource);
  }
}
