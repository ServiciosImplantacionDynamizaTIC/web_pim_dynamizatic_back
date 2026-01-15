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
import {LogImportacion} from '../models/log-importacion.model';
import {LogImportacionRepository} from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class LogImportacionController {
  constructor(
    @repository(LogImportacionRepository)
    public logImportacionRepository : LogImportacionRepository,
  ) {}

  @post('/log-importacions')
  @response(200, {
    description: 'LogImportacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(LogImportacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogImportacion, {
            title: 'NewLogImportacion',
            exclude: ['id'],
          }),
        },
      },
    })
    logImportacion: Omit<LogImportacion, 'id'>,
  ): Promise<LogImportacion> {
    return this.logImportacionRepository.create(logImportacion);
  }

  @get('/log-importacions/count')
  @response(200, {
    description: 'LogImportacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LogImportacion) where?: Where<LogImportacion>,
  ): Promise<Count> {
    const dataSource = this.logImportacionRepository.dataSource;
    return await SqlFilterUtil.ejecutarQueryCount(dataSource, 'log_importacion', where);  
  }

  @get('/log-importacions')
  @response(200, {
    description: 'Array of LogImportacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LogImportacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LogImportacion) filter?: Filter<LogImportacion>,
  ): Promise<LogImportacion[]> {
    const dataSource = this.logImportacionRepository.dataSource;
    const camposSelect = "*"
    return await SqlFilterUtil.ejecutarQuerySelect(dataSource, 'log_importacion', filter, camposSelect);
  }

  @patch('/log-importacions')
  @response(200, {
    description: 'LogImportacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogImportacion, {partial: true}),
        },
      },
    })
    logImportacion: LogImportacion,
    @param.where(LogImportacion) where?: Where<LogImportacion>,
  ): Promise<Count> {
    return this.logImportacionRepository.updateAll(logImportacion, where);
  }

  @get('/log-importacions/{id}')
  @response(200, {
    description: 'LogImportacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LogImportacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LogImportacion, {exclude: 'where'}) filter?: FilterExcludingWhere<LogImportacion>
  ): Promise<LogImportacion> {
    return this.logImportacionRepository.findById(id, filter);
  }

  @patch('/log-importacions/{id}')
  @response(204, {
    description: 'LogImportacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogImportacion, {partial: true}),
        },
      },
    })
    logImportacion: LogImportacion,
  ): Promise<void> {
    await this.logImportacionRepository.updateById(id, logImportacion);
  }

  @put('/log-importacions/{id}')
  @response(204, {
    description: 'LogImportacion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() logImportacion: LogImportacion,
  ): Promise<void> {
    await this.logImportacionRepository.replaceById(id, logImportacion);
  }

  @del('/log-importacions/{id}')
  @response(204, {
    description: 'LogImportacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.logImportacionRepository.deleteById(id);
  }
}

