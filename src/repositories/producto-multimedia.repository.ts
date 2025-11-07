import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {ProductoMultimedia, ProductoMultimediaRelations} from '../models/producto-multimedia.model';

export class ProductoMultimediaRepository extends DefaultCrudRepository<
  ProductoMultimedia,
  typeof ProductoMultimedia.prototype.id,
  ProductoMultimediaRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(ProductoMultimedia, dataSource);
  }
}
