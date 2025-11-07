import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {TraduccionLiteral, TraduccionLiteralRelations} from '../models/traduccion-literal.model';

export class TraduccionLiteralRepository extends DefaultCrudRepository<
  TraduccionLiteral,
  typeof TraduccionLiteral.prototype.id,
  TraduccionLiteralRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(TraduccionLiteral, dataSource);
  }
}
