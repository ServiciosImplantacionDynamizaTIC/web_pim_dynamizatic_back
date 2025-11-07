import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {CategoriaGrupoAtributo, CategoriaGrupoAtributoRelations} from '../models/categoria-grupo-atributo.model';

export class CategoriaGrupoAtributoRepository extends DefaultCrudRepository<
  CategoriaGrupoAtributo,
  typeof CategoriaGrupoAtributo.prototype.id,
  CategoriaGrupoAtributoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(CategoriaGrupoAtributo, dataSource);
  }
}
