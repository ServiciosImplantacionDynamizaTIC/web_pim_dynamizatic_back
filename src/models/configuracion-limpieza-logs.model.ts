import { Entity, model, property } from '@loopback/repository';

@model({
  settings: {
    idInjection: true,
    mysql: {schema: 'svan', table: 'configuracion_limpieza_logs'},
  },
})
export class ConfiguracionLimpiezaLogs extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    mysql: {columnName: 'id', dataType: 'int', nullable: 'N'},
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
    precision: 6,
    scale: 0,
    mysql: {columnName: 'empresaId', dataType: 'smallint', dataLength: null, dataPrecision: 6, dataScale: 0, nullable: 'N'},
  })
  empresaId: number;

  @property({
    type: 'string',
    required: true,
    length: 45,
    mysql: {columnName: 'nombreTabla', dataType: 'varchar', dataLength: 45, nullable: 'N'},
  })
  nombreTabla: string;

  @property({
    type: 'number',
    required: true,
    mysql: {columnName: 'numeroDiasRetencion', dataType: 'int', nullable: 'N'},
  })
  numeroDiasRetencion: number;

  @property({
    type: 'string',
    required: true,
    length: 45,
    mysql: {columnName: 'campoFechaTabla', dataType: 'varchar', dataLength: 45, nullable: 'N'},
  })
  campoFechaTabla: string;

  @property({
    type: 'date',
    mysql: {columnName: 'fechaUltimoBorrado', dataType: 'datetime', nullable: 'Y'},
  })
  fechaUltimoBorrado?: string;

  @property({
    type: 'date',
    mysql: {columnName: 'fechaUltimaEjecucion', dataType: 'datetime', nullable: 'Y'},
  })
  fechaUltimaEjecucion?: string;

  @property({
    type: 'string',
    length: 1,
    mysql: {columnName: 'activoSn', dataType: 'char', dataLength: 1, nullable: 'Y'},
  })
  activoSn?: string;

  constructor(data?: Partial<ConfiguracionLimpiezaLogs>) {
    super(data);
  }
}

export interface ConfiguracionLimpiezaLogsRelations {
  // describe navigational properties here
}

export type ConfiguracionLimpiezaLogsWithRelations = ConfiguracionLimpiezaLogs & ConfiguracionLimpiezaLogsRelations;
