import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {Marketplace, MarketplaceRelations} from '../models/marketplace.model';

export class MarketplaceRepository extends DefaultCrudRepository<
  Marketplace,
  typeof Marketplace.prototype.id,
  MarketplaceRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(Marketplace, dataSource);
  }
}
