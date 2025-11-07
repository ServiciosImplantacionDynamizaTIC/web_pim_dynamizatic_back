import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {ProductoMarketplace, ProductoMarketplaceRelations} from '../models/producto-marketplace.model';

export class ProductoMarketplaceRepository extends DefaultCrudRepository<
  ProductoMarketplace,
  typeof ProductoMarketplace.prototype.id,
  ProductoMarketplaceRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(ProductoMarketplace, dataSource);
  }
}
