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
import {LogSincronizacion} from '../models/log-sincronizacion.model';
import {LogSincronizacionRepository} from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class LogSincronizacionController {
  constructor(
    @repository(LogSincronizacionRepository)
    public logSincronizacionRepository : LogSincronizacionRepository,
  ) {}

  @post('/log-sincronizacions')
  @response(200, {
    description: 'LogSincronizacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(LogSincronizacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogSincronizacion, {
            title: 'NewLogSincronizacion',
            exclude: ['id'],
          }),
        },
      },
    })
    logSincronizacion: Omit<LogSincronizacion, 'id'>,
  ): Promise<LogSincronizacion> {
    return this.logSincronizacionRepository.create(logSincronizacion);
  }

  @get('/log-sincronizacions/count')
  @response(200, {
    description: 'LogSincronizacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LogSincronizacion) where?: Where<LogSincronizacion>,
  ): Promise<Count> {
    const dataSource = this.logSincronizacionRepository.dataSource;
    return await SqlFilterUtil.ejecutarQueryCount(dataSource, 'log_sincronizacion', where);
  }

  @get('/log-sincronizacions')
  @response(200, {
    description: 'Array of LogSincronizacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LogSincronizacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LogSincronizacion) filter?: Filter<LogSincronizacion>,
  ): Promise<LogSincronizacion[]> {
    const dataSource = this.logSincronizacionRepository.dataSource;
    const camposSelect = "*";
    return await SqlFilterUtil.ejecutarQuerySelect(dataSource, 'log_sincronizacion', filter, camposSelect);
  }

  @patch('/log-sincronizacions')
  @response(200, {
    description: 'LogSincronizacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogSincronizacion, {partial: true}),
        },
      },
    })
    logSincronizacion: LogSincronizacion,
    @param.where(LogSincronizacion) where?: Where<LogSincronizacion>,
  ): Promise<Count> {
    return this.logSincronizacionRepository.updateAll(logSincronizacion, where);
  }

  @get('/log-sincronizacions/{id}')
  @response(200, {
    description: 'LogSincronizacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LogSincronizacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LogSincronizacion, {exclude: 'where'}) filter?: FilterExcludingWhere<LogSincronizacion>
  ): Promise<LogSincronizacion> {
    return this.logSincronizacionRepository.findById(id, filter);
  }

  @patch('/log-sincronizacions/{id}')
  @response(204, {
    description: 'LogSincronizacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogSincronizacion, {partial: true}),
        },
      },
    })
    logSincronizacion: LogSincronizacion,
  ): Promise<void> {
    await this.logSincronizacionRepository.updateById(id, logSincronizacion);
  }

  @put('/log-sincronizacions/{id}')
  @response(204, {
    description: 'LogSincronizacion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() logSincronizacion: LogSincronizacion,
  ): Promise<void> {
    await this.logSincronizacionRepository.replaceById(id, logSincronizacion);
  }

  @del('/log-sincronizacions/{id}')
  @response(204, {
    description: 'LogSincronizacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.logSincronizacionRepository.deleteById(id);
  }
}

