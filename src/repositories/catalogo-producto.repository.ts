import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {CatalogoProducto, CatalogoProductoRelations} from '../models/catalogo-producto.model';

export class CatalogoProductoRepository extends DefaultCrudRepository<
  CatalogoProducto,
  typeof CatalogoProducto.prototype.id,
  CatalogoProductoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(CatalogoProducto, dataSource);
  }
}
