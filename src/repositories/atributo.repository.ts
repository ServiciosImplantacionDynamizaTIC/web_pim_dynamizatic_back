import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {Atributo, AtributoRelations} from '../models/atributo.model';

export class AtributoRepository extends DefaultCrudRepository<
  Atributo,
  typeof Atributo.prototype.id,
  AtributoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(Atributo, dataSource);
  }
}
