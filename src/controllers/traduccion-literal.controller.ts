import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { TraduccionLiteral } from '../models/traduccion-literal.model';
import { TraduccionLiteralRepository } from '../repositories';

export class TraduccionLiteralController {
  constructor(
    @repository(TraduccionLiteralRepository)
    public traduccionLiteralRepository: TraduccionLiteralRepository,
  ) { }

  @post('/traduccion-literals')
  @response(200, {
    description: 'TraduccionLiteral model instance',
    content: { 'application/json': { schema: getModelSchemaRef(TraduccionLiteral) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionLiteral, {
            title: 'NewTraduccionLiteral'
          }),
        },
      },
    })
    traduccionLiteral: TraduccionLiteral, // Permite incluir el id
  ): Promise<TraduccionLiteral> {
    //
    // Si me llega el id borro el registro 
    //
    if (traduccionLiteral.id) {
      //
      //Verificamos si el registro existe para borrarlo, sino no lo hacemos
      //
      const count = await this.traduccionLiteralRepository.count({ id: traduccionLiteral.id });
      if (count.count > 0) {
        await this.traduccionLiteralRepository.deleteAll({ clave: traduccionLiteral.clave });
      }
      delete traduccionLiteral.id;
    }
    return this.traduccionLiteralRepository.create(traduccionLiteral);
  }

  @get('/traduccion-literals/count')
  @response(200, {
    description: 'Devuelve el count de las traducciones y sus idiomas',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async count(
    @param.where(TraduccionLiteral) where?: Where<TraduccionLiteral>,
  ): Promise<TraduccionLiteral[]> {
    const dataSource = this.traduccionLiteralRepository.dataSource;

    // Obtiene los idiomas activos para mapearlos
    const idiomasQuery = `SELECT id, iso, nombre FROM idioma ORDER BY nombre ASC`;
    const idiomas = await dataSource.execute(idiomasQuery);

    // Crear un mapa de nombre de idioma -> ID para búsqueda rápida
    const idiomaMap = new Map<string, number>();
    let pivotColumns = '';
    for (const idioma of idiomas) {
      const columnName = idioma.nombre.replace(/\s+/g, '_').toLowerCase();
      idiomaMap.set(columnName, idioma.id);
      pivotColumns += ` LEFT JOIN traduccion_literal t${idioma.id} ON t.clave = t${idioma.id}.clave AND t${idioma.id}.idiomaId = ${idioma.id}`;
    }

    // Construye la consulta base
    let query = `
      SELECT COUNT(DISTINCT t.clave) AS count
      FROM traduccion_literal t
      ${pivotColumns}
    `;

    // Aplicamos filtros
    let filtros = '';
    filtros += ` WHERE 1=1`
    if (where) {
      for (const [key] of Object.entries(where)) {
        if (key === 'and' || key === 'or' || key === 'andNot' || key === 'orNot') {
          let first = true;
          for (const [subKey, subValue] of Object.entries((where as any)[key])) {
            if (subValue !== '' && subValue != null) {
              if (!first) {
                if (key === 'and' || key === 'andNot') {
                  filtros += ` AND`;
                } else if (key === 'or' || key === 'orNot') {
                  filtros += ` OR`;
                }
              } else {
                filtros += ' AND (';
              }

              // Verificar si el campo es un idioma dinámico o un campo real de la tabla
              if (subKey === 'clave') {
                // Campo real de la tabla
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  if (key === 'and' || key === 'or') {
                    filtros += ` t.${subKey} = ${subValue}`;
                  } else {
                    filtros += ` t.${subKey} != ${subValue}`;
                  }
                } else {
                  if (key === 'and' || key === 'or') {
                    filtros += ` t.${subKey} LIKE '%${subValue}%'`;
                  } else {
                    filtros += ` t.${subKey} NOT LIKE '%${subValue}%'`;
                  }
                }
              } else if (idiomaMap.has(subKey)) {
                // Campo dinámico de idioma - buscar en las tablas JOIN
                const idiomaId = idiomaMap.get(subKey);
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  if (key === 'and' || key === 'or') {
                    filtros += ` t${idiomaId}.valor = '${subValue}'`;
                  } else {
                    filtros += ` t${idiomaId}.valor != '${subValue}'`;
                  }
                } else {
                  if (key === 'and' || key === 'or') {
                    filtros += ` t${idiomaId}.valor LIKE '%${subValue}%'`;
                  } else {
                    filtros += ` t${idiomaId}.valor NOT LIKE '%${subValue}%'`;
                  }
                }
              } else {
                // Campo desconocido, usar t. por defecto
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  if (key === 'and' || key === 'or') {
                    filtros += ` t.${subKey} = ${subValue}`;
                  } else {
                    filtros += ` t.${subKey} != ${subValue}`;
                  }
                } else {
                  if (key === 'and' || key === 'or') {
                    filtros += ` t.${subKey} LIKE '%${subValue}%'`;
                  } else {
                    filtros += ` t.${subKey} NOT LIKE '%${subValue}%'`;
                  }
                }
              }
              first = false;
            }
          }
          if (!first) {
            filtros += `)`;
          }
        }
      }
    }

    query += filtros;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @get('/traduccion-literals')
  @response(200, {
    description: 'Devuelve las traducciones y sus idiomas',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async find(
    @param.filter(TraduccionLiteral) filter?: Filter<Object>,
  ): Promise<Object[]> {
    const dataSource = this.traduccionLiteralRepository.dataSource;

    // Obtiene los idiomas activos ordenados alfabéticamente
    const idiomasQuery = `SELECT id, iso, nombre FROM idioma ORDER BY nombre ASC`;
    const idiomas = await dataSource.execute(idiomasQuery);

    // Construye la consulta dinámica de pivote
    let selectColumns = 't.clave, MIN(t.id) as id';  // Agregamos el ID del primer registro
    let pivotColumns = '';

    // Ordena los idiomas alfabéticamente antes de procesarlos
    const idiomasOrdenados = [...idiomas].sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Crear un mapa de nombre de idioma -> ID para búsqueda rápida
    const idiomaMap = new Map<string, number>();
    for (const idioma of idiomasOrdenados) {
      const columnName = idioma.nombre.replace(/\s+/g, '_').toLowerCase();
      idiomaMap.set(columnName, idioma.id);
      // Agrega el valor de la traducción
      selectColumns += `, MAX(CASE WHEN t.idiomaId = ${idioma.id} THEN t.valor END) as "${columnName}"`;
      // Agrega el ID del registro de traducción
      selectColumns += `, MAX(CASE WHEN t.idiomaId = ${idioma.id} THEN t.id END) as "${columnName}Id"`;
      pivotColumns += ` LEFT JOIN traduccion_literal t${idioma.id} ON t.clave = t${idioma.id}.clave AND t${idioma.id}.idiomaId = ${idioma.id}`;
    }

    // Construye la consulta base con el orden correcto de las cláusulas
    let query = `
      SELECT ${selectColumns}
      FROM traduccion_literal t
      ${pivotColumns}
    `;

    // Aplica la cláusula WHERE si existen filtros
    if (filter?.where) {
      query += ` WHERE 1=1`;
      for (const [key] of Object.entries(filter?.where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true;
            for (const [subKey, subValue] of Object.entries((filter?.where as any)[key])) {
              if (subValue !== '' && subValue != null) {
                if (!first) {
                  if (key === 'and') {
                    query += ` AND`;
                  } else {
                    query += ` OR`;
                  }
                } else {
                  query += ' AND (';
                }

                // Verificar si el campo es un idioma dinámico o un campo real de la tabla
                if (subKey === 'clave') {
                  // Campo real de la tabla
                  if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                    query += ` t.${subKey} = ${subValue}`;
                  } else {
                    query += ` t.${subKey} LIKE '%${subValue}%'`;
                  }
                } else if (idiomaMap.has(subKey)) {
                  // Campo dinámico de idioma - buscar en las tablas JOIN
                  const idiomaId = idiomaMap.get(subKey);
                  if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                    query += ` t${idiomaId}.valor = '${subValue}'`;
                  } else {
                    query += ` t${idiomaId}.valor LIKE '%${subValue}%'`;
                  }
                } else {
                  // Campo desconocido, usar t. por defecto
                  if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                    query += ` t.${subKey} = ${subValue}`;
                  } else {
                    query += ` t.${subKey} LIKE '%${subValue}%'`;
                  }
                }
                first = false;
              }
            }
            if (!first) {
              query += `)`;
            }
          }
        }
      }
    }

    // Agrega la cláusula GROUP BY
    query += ` GROUP BY t.clave`;

    // Agrega la cláusula ORDER BY
    if (filter?.order) {
      query += ` ORDER BY ${filter.order}`;
    } else {
      query += ` ORDER BY t.clave ASC`;
    }

    // Agrega LIMIT y OFFSET para la paginación
    if (filter?.limit) {
      query += ` LIMIT ${filter?.limit}`;
    }
    if (filter?.offset) {
      query += ` OFFSET ${filter?.offset}`;
    }

    const registros = await dataSource.execute(query);
    return registros;
  }

  @patch('/traduccion-literals')
  @response(200, {
    description: 'TraduccionLiteral PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionLiteral, { partial: true }),
        },
      },
    })
    traduccionLiteral: TraduccionLiteral,
    @param.where(TraduccionLiteral) where?: Where<TraduccionLiteral>,
  ): Promise<Count> {
    return this.traduccionLiteralRepository.updateAll(traduccionLiteral, where);
  }

  @get('/traduccion-literals/{id}')
  @response(200, {
    description: 'TraduccionLiteral model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TraduccionLiteral, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TraduccionLiteral, { exclude: 'where' }) filter?: FilterExcludingWhere<TraduccionLiteral>
  ): Promise<TraduccionLiteral> {
    return this.traduccionLiteralRepository.findById(id, filter);
  }

  @patch('/traduccion-literals/{id}')
  @response(204, {
    description: 'TraduccionLiteral PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionLiteral, { partial: true }),
        },
      },
    })
    traduccionLiteral: TraduccionLiteral,
  ): Promise<void> {
    await this.traduccionLiteralRepository.updateById(id, traduccionLiteral);
  }

  @put('/traduccion-literals/{id}')
  @response(204, {
    description: 'TraduccionLiteral PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() traduccionLiteral: TraduccionLiteral,
  ): Promise<void> {
    await this.traduccionLiteralRepository.replaceById(id, traduccionLiteral);
  }

  @del('/traduccion-literals/{id}')
  @response(204, {
    description: 'TraduccionLiteral DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    //
    // Primero obtenemos el registro para obtener la clave
    //
    const registro = await this.traduccionLiteralRepository.findById(id);
    //
    // Eliminamos todos los registros que tengan esa clave
    //
    await this.traduccionLiteralRepository.deleteAll({ clave: registro.clave });
  }

  @get('/buscarTraduccionLiteral')
  @response(200, {
    description: 'Devuelve la traducción basada en el código ISO',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async buscarTraduccionLiteral(
    @param.query.string('iso') iso: string,
  ): Promise<object | null> {
    try {
      const dataSource = this.traduccionLiteralRepository.dataSource;
      const query = `SELECT * FROM vista_traduccion_literal_idioma WHERE iso = ?`;
      const result = await dataSource.execute(query, [iso]);
      return result.length > 0 ? result : null;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Error executing query');
    }
  }
}

