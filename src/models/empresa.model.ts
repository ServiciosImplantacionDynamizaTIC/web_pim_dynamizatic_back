import { Entity, model, property } from '@loopback/repository';

@model({ settings: { idInjection: false, mysql: { schema: 'pim_dynamizatic', table: 'empresa' } } })
export class Empresa extends Entity {
  @property({
    type: 'number',
    jsonSchema: { nullable: false },
    precision: 5,
    scale: 0,
    generated: 1,
    id: 1,
    mysql: { columnName: 'id', dataType: 'smallint', dataLength: null, dataPrecision: 5, dataScale: 0, nullable: 'N', generated: 1 },
  })
  id?: number;


  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 20,
    generated: false,
    mysql: { columnName: 'codigo', dataType: 'varchar', dataLength: 20, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false },
  })
  codigo?: string;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 50,
    generated: false,
    mysql: { columnName: 'nombre', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false },
  })
  nombre?: string;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 500,
    generated: false,
    mysql: { columnName: 'descripcion', dataType: 'varchar', dataLength: 500, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false },
  })
  descripcion?: string;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 1,
    generated: false,
    mysql: { columnName: 'activoSn', dataType: 'varchar', dataLength: 1, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false, default: 'S' },
  })
  activoSn?: string;

  @property({
    type: 'date',
    jsonSchema: { nullable: true },
    generated: false,
    mysql: { columnName: 'fechaCreacion', dataType: 'timestamp', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false },
  })
  fechaCreacion?: string;

  @property({
    type: 'date',
    jsonSchema: { nullable: true },
    generated: false,
    mysql: { columnName: 'fechaModificacion', dataType: 'timestamp', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false },
  })
  fechaModificacion?: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: { nullable: false },
    precision: 10,
    scale: 0,
    generated: false,
    mysql: { columnName: 'usuarioCreacion', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'N', generated: false },
  })
  usuarioCreacion: number;

  @property({
    type: 'number',
    jsonSchema: { nullable: true },
    precision: 10,
    scale: 0,
    generated: false,
    mysql: { columnName: 'usuarioModificacion', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'Y', generated: false },
  })
  usuarioModificacion?: number;

  @property({
    type: 'number',
    jsonSchema: { nullable: false },
    precision: 11,
    scale: 0,
    generated: false,
    mysql: { columnName: 'tiempoInactividad', dataType: 'int', dataLength: null, dataPrecision: 11, dataScale: 0, nullable: 'Y', generated: false },
  })
  tiempoInactividad: number;

  @property({
    type: 'boolean',
    jsonSchema: { nullable: true },
    generated: false,
    mysql: { columnName: 'temaRipple', dataType: 'tinyint', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false, default: false },
  })
  temaRipple?: boolean;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 20,
    generated: false,
    mysql: { columnName: 'estiloInput', dataType: 'varchar', dataLength: 20, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false, default: 'outlined' },
  })
  estiloInput?: string;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 20,
    generated: false,
    mysql: { columnName: 'modoMenu', dataType: 'varchar', dataLength: 20, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false, default: 'static' },
  })
  modoMenu?: string;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 20,
    generated: false,
    mysql: { columnName: 'temaMenu', dataType: 'varchar', dataLength: 20, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false, default: 'colorScheme' },
  })
  temaMenu?: string;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 10,
    generated: false,
    mysql: { columnName: 'esquemaColor', dataType: 'varchar', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false, default: 'light' },
  })
  esquemaColor?: string;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 20,
    generated: false,
    mysql: { columnName: 'tema', dataType: 'varchar', dataLength: 20, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false, default: 'mitema' },
  })
  tema?: string;

  @property({
    type: 'number',
    jsonSchema: { nullable: true },
    precision: 11,
    scale: 0,
    generated: false,
    mysql: { columnName: 'escala', dataType: 'int', dataLength: null, dataPrecision: 11, dataScale: 0, nullable: 'Y', generated: false, default: 14 },
  })
  escala?: number;


  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 250,
    generated: false,
    mysql: { columnName: 'email', dataType: 'varchar', dataLength: 250, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false },
  })
  email?: string;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 100,
    generated: false,
    mysql: { columnName: 'password', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false },
  })
  password?: string;

  @property({
    type: 'string',
    jsonSchema: { nullable: true },
    length: 100,
    generated: false,
    mysql: { columnName: 'servicio', dataType: 'varchar', dataLength: 45, dataPrecision: null, dataScale: null, nullable: 'Y', generated: false },
  })
  servicio?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Empresa>) {
    super(data);
  }
}

export interface EmpresaRelations {
  // describe navigational properties here
}

export type EmpresaWithRelations = Empresa & EmpresaRelations;
