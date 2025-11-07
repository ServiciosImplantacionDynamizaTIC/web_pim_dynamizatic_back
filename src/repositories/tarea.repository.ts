import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {Tarea, TareaRelations} from '../models/tarea.model';

export class TareaRepository extends DefaultCrudRepository<
  Tarea,
  typeof Tarea.prototype.id,
  TareaRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(Tarea, dataSource);
  }
}
