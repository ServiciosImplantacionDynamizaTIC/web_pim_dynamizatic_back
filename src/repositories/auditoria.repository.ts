import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {Auditoria, AuditoriaRelations} from '../models/auditoria.model';

export class AuditoriaRepository extends DefaultCrudRepository<
  Auditoria,
  typeof Auditoria.prototype.id,
  AuditoriaRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(Auditoria, dataSource);
  }
}
