import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {CampoDinamico, CampoDinamicoRelations} from '../models/campo-dinamico.model';

export class CampoDinamicoRepository extends DefaultCrudRepository<
  CampoDinamico,
  typeof CampoDinamico.prototype.id,
  CampoDinamicoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(CampoDinamico, dataSource);
  }
}
