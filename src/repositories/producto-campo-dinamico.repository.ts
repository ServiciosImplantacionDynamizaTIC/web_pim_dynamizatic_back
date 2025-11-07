import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {ProductoCampoDinamico, ProductoCampoDinamicoRelations} from '../models/producto-campo-dinamico.model';

export class ProductoCampoDinamicoRepository extends DefaultCrudRepository<
  ProductoCampoDinamico,
  typeof ProductoCampoDinamico.prototype.id,
  ProductoCampoDinamicoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(ProductoCampoDinamico, dataSource);
  }
}
