import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {MensajePlantillaCategoria, MensajePlantillaCategoriaRelations} from '../models';

export class MensajePlantillaCategoriaRepository extends DefaultCrudRepository<
  MensajePlantillaCategoria,
  typeof MensajePlantillaCategoria.prototype.id,
  MensajePlantillaCategoriaRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(MensajePlantillaCategoria, dataSource);
  }
}
