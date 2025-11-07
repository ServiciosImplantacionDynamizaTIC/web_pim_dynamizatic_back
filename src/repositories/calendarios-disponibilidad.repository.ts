import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ApiBackendDataSource} from '../datasources';
import {CalendariosDisponibilidad, CalendariosDisponibilidadRelations} from '../models';

export class CalendariosDisponibilidadRepository extends DefaultCrudRepository<
  CalendariosDisponibilidad,
  typeof CalendariosDisponibilidad.prototype.id,
  CalendariosDisponibilidadRelations
> {
  constructor(
    @inject('datasources.ApiBackend') dataSource: ApiBackendDataSource,
  ) {
    super(CalendariosDisponibilidad, dataSource);
  }
}
