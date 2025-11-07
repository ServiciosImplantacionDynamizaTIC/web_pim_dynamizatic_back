import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {GrupoAtributo, GrupoAtributoRelations} from '../models/grupo-atributo.model';

export class GrupoAtributoRepository extends DefaultCrudRepository<
  GrupoAtributo,
  typeof GrupoAtributo.prototype.id,
  GrupoAtributoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(GrupoAtributo, dataSource);
  }
}
