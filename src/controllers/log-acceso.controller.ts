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
import {LogAcceso} from '../models';
import {LogAccesoRepository} from '../repositories';

export class LogAccesoController {
  constructor(
    @repository(LogAccesoRepository)
    public logAccesoRepository : LogAccesoRepository,
  ) {}

  @post('/log-accesos')
  @response(200, {
    description: 'LogAcceso model instance',
    content: {'application/json': {schema: getModelSchemaRef(LogAcceso)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogAcceso, {
            title: 'NewLogAcceso',
            exclude: ['id'],
          }),
        },
      },
    })
    logAcceso: Omit<LogAcceso, 'id'>,
  ): Promise<LogAcceso> {
    return this.logAccesoRepository.create(logAcceso);
  }

  @get('/log-accesos/count')
  @response(200, {
    description: 'LogAcceso model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LogAcceso) where?: Where<LogAcceso>,
  ): Promise<Count> {
    const dataSource = this.logAccesoRepository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += ` WHERE 1=1`
    if (where) {
      for (const [key] of Object.entries(where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((where as any)[key])) {
              if (subValue !== '' && subValue != null) {
                if (!first) {
                  if (key === 'and') {
                    filtros += ` AND`;
                  }
                  else {
                    filtros += ` OR`;
                  }
                }
                else {
                  filtros += ' AND ('
                }
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  filtros += ` ${subKey} = ${subValue}`;
                }
                else {
                  filtros += ` ${subKey} LIKE '%${subValue}%'`;
                }
                first = false
              }
            }
            if (!first) {
              filtros += `)`;
            }
          }
        }

      }
    }
    const query = `SELECT COUNT(*) AS count FROM vista_log_acceso_usuario${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros;
  }

  @get('/log-accesos')
  @response(200, {
    description: 'Array of LogAcceso model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LogAcceso, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LogAcceso) filter?: Filter<LogAcceso>,
  ): Promise<LogAcceso[]> {
    const dataSource = this.logAccesoRepository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += ` WHERE 1=1`
    if (filter?.where) {
      for (const [key] of Object.entries(filter?.where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((filter?.where as any)[key])) {
              if (subValue !== '' && subValue != null) {
                if (!first) {
                  if (key === 'and') {
                    filtros += ` AND`;
                  }
                  else {
                    filtros += ` OR`;
                  }
                }
                else {
                  filtros += ' AND ('
                }
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  filtros += ` ${subKey} = ${subValue}`;
                }
                else {
                  filtros += ` ${subKey} LIKE '%${subValue}%'`;
                }
                first = false
              }
            }
            if (!first) {
              filtros += `)`;
            }
          }
        }

      }
    }
    // Agregar ordenamiento
    if (filter?.order) {
      filtros += ` ORDER BY ${filter.order}`;
    }
    // Agregar paginación
    if (filter?.limit) {
      filtros += ` LIMIT ${filter?.limit}`;
    }
    if (filter?.offset) {
      filtros += ` OFFSET ${filter?.offset}`;
    }
    const query = `SELECT * FROM vista_log_acceso_usuario${filtros}`;
    const registros = await dataSource.execute(query);
    return registros;
  }

  @patch('/log-accesos')
  @response(200, {
    description: 'LogAcceso PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogAcceso, {partial: true}),
        },
      },
    })
    logAcceso: LogAcceso,
    @param.where(LogAcceso) where?: Where<LogAcceso>,
  ): Promise<Count> {
    return this.logAccesoRepository.updateAll(logAcceso, where);
  }

  @get('/log-accesos/{id}')
  @response(200, {
    description: 'LogAcceso model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LogAcceso, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LogAcceso, {exclude: 'where'}) filter?: FilterExcludingWhere<LogAcceso>
  ): Promise<LogAcceso> {
    return this.logAccesoRepository.findById(id, filter);
  }

  @patch('/log-accesos/{id}')
  @response(204, {
    description: 'LogAcceso PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogAcceso, {partial: true}),
        },
      },
    })
    logAcceso: LogAcceso,
  ): Promise<void> {
    await this.logAccesoRepository.updateById(id, logAcceso);
  }

  @put('/log-accesos/{id}')
  @response(204, {
    description: 'LogAcceso PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() logAcceso: LogAcceso,
  ): Promise<void> {
    await this.logAccesoRepository.replaceById(id, logAcceso);
  }

  @del('/log-accesos/{id}')
  @response(204, {
    description: 'LogAcceso DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.logAccesoRepository.deleteById(id);
  }
}
