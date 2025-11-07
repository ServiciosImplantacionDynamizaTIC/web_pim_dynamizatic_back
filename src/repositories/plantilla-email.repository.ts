import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {PlantillaEmail, PlantillaEmailRelations} from '../models';

export class PlantillaEmailRepository extends DefaultCrudRepository<
  PlantillaEmail,
  typeof PlantillaEmail.prototype.id,
  PlantillaEmailRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(PlantillaEmail, dataSource);
  }
}
