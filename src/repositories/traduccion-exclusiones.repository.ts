import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {TraduccionExclusiones, TraduccionExclusionesRelations} from '../models';

export class TraduccionExclusionesRepository extends DefaultCrudRepository<
  TraduccionExclusiones,
  typeof TraduccionExclusiones.prototype.id,
  TraduccionExclusionesRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(TraduccionExclusiones, dataSource);
  }
}
