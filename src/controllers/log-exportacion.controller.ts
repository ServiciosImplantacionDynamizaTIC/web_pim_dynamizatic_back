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
import {LogExportacion} from '../models/log-exportacion.model';
import {LogExportacionRepository} from '../repositories';

export class LogExportacionController {
  constructor(
    @repository(LogExportacionRepository)
    public logExportacionRepository : LogExportacionRepository,
  ) {}

  @post('/log-exportacions')
  @response(200, {
    description: 'LogExportacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(LogExportacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogExportacion, {
            title: 'NewLogExportacion',
            exclude: ['id'],
          }),
        },
      },
    })
    logExportacion: Omit<LogExportacion, 'id'>,
  ): Promise<LogExportacion> {
    return this.logExportacionRepository.create(logExportacion);
  }

  @get('/log-exportacions/count')
  @response(200, {
    description: 'LogExportacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LogExportacion) where?: Where<LogExportacion>,
  ): Promise<Count> {
    return this.logExportacionRepository.count(where);
  }

  @get('/log-exportacions')
  @response(200, {
    description: 'Array of LogExportacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LogExportacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LogExportacion) filter?: Filter<LogExportacion>,
  ): Promise<LogExportacion[]> {
    return this.logExportacionRepository.find(filter);
  }

  @patch('/log-exportacions')
  @response(200, {
    description: 'LogExportacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogExportacion, {partial: true}),
        },
      },
    })
    logExportacion: LogExportacion,
    @param.where(LogExportacion) where?: Where<LogExportacion>,
  ): Promise<Count> {
    return this.logExportacionRepository.updateAll(logExportacion, where);
  }

  @get('/log-exportacions/{id}')
  @response(200, {
    description: 'LogExportacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LogExportacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LogExportacion, {exclude: 'where'}) filter?: FilterExcludingWhere<LogExportacion>
  ): Promise<LogExportacion> {
    return this.logExportacionRepository.findById(id, filter);
  }

  @patch('/log-exportacions/{id}')
  @response(204, {
    description: 'LogExportacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogExportacion, {partial: true}),
        },
      },
    })
    logExportacion: LogExportacion,
  ): Promise<void> {
    await this.logExportacionRepository.updateById(id, logExportacion);
  }

  @put('/log-exportacions/{id}')
  @response(204, {
    description: 'LogExportacion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() logExportacion: LogExportacion,
  ): Promise<void> {
    await this.logExportacionRepository.replaceById(id, logExportacion);
  }

  @del('/log-exportacions/{id}')
  @response(204, {
    description: 'LogExportacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.logExportacionRepository.deleteById(id);
  }
}

