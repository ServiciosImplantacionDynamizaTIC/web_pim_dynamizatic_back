import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {Catalogo, CatalogoRelations} from '../models/catalogo.model';

export class CatalogoRepository extends DefaultCrudRepository<
  Catalogo,
  typeof Catalogo.prototype.id,
  CatalogoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(Catalogo, dataSource);
  }
}
