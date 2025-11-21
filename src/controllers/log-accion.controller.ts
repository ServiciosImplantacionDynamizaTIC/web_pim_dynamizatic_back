import { authenticate } from '@loopback/authentication';
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
import {LogAccion} from '../models/log-accion.model';
import {LogAccionRepository} from '../repositories';

@authenticate('jwt')
export class LogAccionController {
  constructor(
    @repository(LogAccionRepository)
    public logAccionRepository : LogAccionRepository,
  ) {}

  @post('/log-accions')
  @response(200, {
    description: 'LogAccion model instance',
    content: {'application/json': {schema: getModelSchemaRef(LogAccion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogAccion, {
            title: 'NewLogAccion',
            exclude: ['id'],
          }),
        },
      },
    })
    logAccion: Omit<LogAccion, 'id'>,
  ): Promise<LogAccion> {
    return this.logAccionRepository.create(logAccion);
  }

  @get('/log-accions/count')
  @response(200, {
    description: 'LogAccion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LogAccion) where?: Where<LogAccion>,
  ): Promise<Count> {
    const dataSource = this.logAccionRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM vista_log_accion_usuario${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros;
  }

  @get('/log-accions')
  @response(200, {
    description: 'Array of LogAccion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LogAccion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LogAccion) filter?: Filter<LogAccion>,
  ): Promise<LogAccion[]> {
    const dataSource = this.logAccionRepository.dataSource;
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
    const query = `SELECT * FROM vista_log_accion_usuario${filtros}`;
    const registros = await dataSource.execute(query);
    return registros;
  }

  @patch('/log-accions')
  @response(200, {
    description: 'LogAccion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogAccion, {partial: true}),
        },
      },
    })
    logAccion: LogAccion,
    @param.where(LogAccion) where?: Where<LogAccion>,
  ): Promise<Count> {
    return this.logAccionRepository.updateAll(logAccion, where);
  }

  @get('/log-accions/{id}')
  @response(200, {
    description: 'LogAccion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LogAccion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LogAccion, {exclude: 'where'}) filter?: FilterExcludingWhere<LogAccion>
  ): Promise<LogAccion> {
    return this.logAccionRepository.findById(id, filter);
  }

  @patch('/log-accions/{id}')
  @response(204, {
    description: 'LogAccion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogAccion, {partial: true}),
        },
      },
    })
    logAccion: LogAccion,
  ): Promise<void> {
    await this.logAccionRepository.updateById(id, logAccion);
  }

  @put('/log-accions/{id}')
  @response(204, {
    description: 'LogAccion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() logAccion: LogAccion,
  ): Promise<void> {
    await this.logAccionRepository.replaceById(id, logAccion);
  }

  @del('/log-accions/{id}')
  @response(204, {
    description: 'LogAccion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.logAccionRepository.deleteById(id);
  }
}
