import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, mysql: {schema: 'pim_dynamizatic', table: 'log_accion'}}
})
export class LogAccion extends Entity {
  @property({
    type: 'number',
    precision: 11,
    scale: 0,
    generated: true,
    id: true,
    mysql: {columnName: 'id', dataType: 'int', dataLength: null, dataPrecision: 11, dataScale: 0, nullable: 'N', generated: true},
  })
  id?: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: false},
    length: 2000,
    generated: false,
    mysql: {columnName: 'url', dataType: 'varchar', dataLength: 2000, dataPrecision: null, dataScale: null, nullable: 'N', generated: false},
  })
  url: string;

  @property({
    type: 'date',
    jsonSchema: {nullable: false},
    generated: false,
    mysql: {columnName: 'fechaInicio', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'N', generated: false},
  })
  fechaInicio: string;

  @property({
    type: 'date',
    jsonSchema: {nullable: false},
    generated: false,
    mysql: {columnName: 'fechaFin', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'N', generated: false},
  })
  fechaFin: string;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
    precision: 15,
    scale: 3,
    generated: false,
    mysql: {columnName: 'segundos', dataType: 'float', dataLength: null, dataPrecision: 15, dataScale: 3, nullable: 'Y', generated: false},
  })
  segundos?: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 2000,
    generated: false,
    mysql: {columnName: 'resultado', dataType: 'varchar', dataLength: 2000, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false},
  })
  resultado?: string;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
    precision: 11,
    scale: 0,
    generated: false,
    mysql: {columnName: 'usuarioId', dataType: 'int', dataLength: null, dataPrecision: 11, dataScale: 0, nullable: 'Y', generated: false},
  })
  usuarioId?: number;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
    precision: 6,
    scale: 0,
    generated: false,
    mysql: {columnName: 'empresaId', dataType: 'smallint', dataLength: null, dataPrecision: 6, dataScale: 0, nullable: 'Y', generated: false},
  })
  empresaId?: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 80,
    generated: false,
    mysql: {columnName: 'nombreEmpresa', dataType: 'varchar', dataLength: 80, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false},
  })
  nombreEmpresa?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 80,
    generated: false,
    mysql: {columnName: 'endPoint', dataType: 'varchar', dataLength: 80, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false},
  })
  endPoint?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 80,
    generated: false,
    mysql: {columnName: 'tipo', dataType: 'varchar', dataLength: 80, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false},
  })
  tipo?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 255,
    generated: false,
    mysql: {columnName: 'controller', dataType: 'varchar', dataLength: 255, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false},
  })
  controller?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 255,
    generated: false,
    mysql: {columnName: 'funcion', dataType: 'varchar', dataLength: 255, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false},
  })
  funcion?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<LogAccion>) {
    super(data);
  }
}

export interface LogAccionRelations {
  // describe navigational properties here
}

export type LogAccionWithRelations = LogAccion & LogAccionRelations;
