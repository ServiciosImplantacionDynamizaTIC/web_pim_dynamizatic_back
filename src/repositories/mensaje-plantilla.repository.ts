import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {MensajePlantilla, MensajePlantillaRelations} from '../models';

export class MensajePlantillaRepository extends DefaultCrudRepository<
  MensajePlantilla,
  typeof MensajePlantilla.prototype.id,
  MensajePlantillaRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(MensajePlantilla, dataSource);
  }
}
