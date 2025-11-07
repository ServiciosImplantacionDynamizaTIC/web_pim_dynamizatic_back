import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {Multimedia, MultimediaRelations} from '../models/multimedia.model';

export class MultimediaRepository extends DefaultCrudRepository<
  Multimedia,
  typeof Multimedia.prototype.id,
  MultimediaRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(Multimedia, dataSource);
  }
}
