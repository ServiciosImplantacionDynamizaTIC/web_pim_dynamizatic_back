import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {ConfiguracionDiseno, ConfiguracionDisenoRelations} from '../models/configuracion-diseno.model';

export class ConfiguracionDisenoRepository extends DefaultCrudRepository<
  ConfiguracionDiseno,
  typeof ConfiguracionDiseno.prototype.id,
  ConfiguracionDisenoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(ConfiguracionDiseno, dataSource);
  }
}
