import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {TipoArchivo, TipoArchivoRelations} from '../models';

export class TipoArchivoRepository extends DefaultCrudRepository<
  TipoArchivo,
  typeof TipoArchivo.prototype.id,
  TipoArchivoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(TipoArchivo, dataSource);
  }
}
