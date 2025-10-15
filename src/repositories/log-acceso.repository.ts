import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BbddmysqlDataSource} from '../datasources';
import {LogAcceso, LogAccesoRelations} from '../models';

export class LogAccesoRepository extends DefaultCrudRepository<
  LogAcceso,
  typeof LogAcceso.prototype.id,
  LogAccesoRelations
> {
  constructor(
    @inject('datasources.Bbddmysql') dataSource: BbddmysqlDataSource,
  ) {
    super(LogAcceso, dataSource);
  }
}
