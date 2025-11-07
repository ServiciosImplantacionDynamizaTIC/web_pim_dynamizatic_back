import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {Icono, IconoRelations} from '../models/icono.model';
export class IconoRepository extends DefaultCrudRepository<
  Icono,
  typeof Icono.prototype.id,
  IconoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(Icono, dataSource);
  }
}
