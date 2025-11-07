import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {ProductoIcono, ProductoIconoRelations} from '../models/producto-icono.model';

export class ProductoIconoRepository extends DefaultCrudRepository<
  ProductoIcono,
  typeof ProductoIcono.prototype.id,
  ProductoIconoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(ProductoIcono, dataSource);
  }
}
