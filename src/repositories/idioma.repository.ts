import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {Idioma, IdiomaRelations} from '../models';

export class IdiomaRepository extends DefaultCrudRepository<
  Idioma,
  typeof Idioma.prototype.id,
  IdiomaRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(Idioma, dataSource);
  }
}
