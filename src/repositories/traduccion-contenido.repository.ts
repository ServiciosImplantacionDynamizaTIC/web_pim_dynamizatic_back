import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {TraduccionContenido, TraduccionContenidoRelations} from '../models/traduccion-contenido.model';

export class TraduccionContenidoRepository extends DefaultCrudRepository<
  TraduccionContenido,
  typeof TraduccionContenido.prototype.id,
  TraduccionContenidoRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(TraduccionContenido, dataSource);
  }
}
