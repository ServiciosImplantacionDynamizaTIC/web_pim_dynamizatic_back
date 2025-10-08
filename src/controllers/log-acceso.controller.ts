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
import {LogAcceso} from '../models/log-acceso.model';
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
    return this.logAccesoRepository.count(where);
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
    return this.logAccesoRepository.find(filter);
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

