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
    del,
    get,
    getModelSchemaRef,
    param,
    patch,
    post,
    put,
    requestBody,
    response,
} from '@loopback/rest';
import { ConfiguracionLimpiezaLogs } from '../models';
import { ConfiguracionLimpiezaLogsRepository } from '../repositories';

@authenticate('jwt')
export class ConfiguracionLimpiezaLogsController {
  constructor(
    @repository(ConfiguracionLimpiezaLogsRepository)
    public configuracionLimpiezaLogsRepository: ConfiguracionLimpiezaLogsRepository,
  ) {}

  @post('/configuracion-limpieza-logs')
  @response(200, {
    description: 'ConfiguracionLimpiezaLogs model instance',
    content: {'application/json': {schema: getModelSchemaRef(ConfiguracionLimpiezaLogs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ConfiguracionLimpiezaLogs, {
            title: 'NewConfiguracionLimpiezaLogs',
            exclude: ['id'],
          }),
        },
      },
    })
    configuracionLimpiezaLogs: Omit<ConfiguracionLimpiezaLogs, 'id'>,
  ): Promise<ConfiguracionLimpiezaLogs> {
    return this.configuracionLimpiezaLogsRepository.create(configuracionLimpiezaLogs);
  }

  @get('/configuracion-limpieza-logs/count')
  @response(200, {
    description: 'ConfiguracionLimpiezaLogs model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ConfiguracionLimpiezaLogs) where?: Where<ConfiguracionLimpiezaLogs>,
  ): Promise<Count> {
    return this.configuracionLimpiezaLogsRepository.count(where);
  }

  @get('/configuracion-limpieza-logs')
  @response(200, {
    description: 'Array of ConfiguracionLimpiezaLogs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ConfiguracionLimpiezaLogs, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ConfiguracionLimpiezaLogs) filter?: Filter<ConfiguracionLimpiezaLogs>,
  ): Promise<ConfiguracionLimpiezaLogs[]> {
    return this.configuracionLimpiezaLogsRepository.find(filter);
  }

  @patch('/configuracion-limpieza-logs')
  @response(200, {
    description: 'ConfiguracionLimpiezaLogs PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ConfiguracionLimpiezaLogs, {partial: true}),
        },
      },
    })
    configuracionLimpiezaLogs: ConfiguracionLimpiezaLogs,
    @param.where(ConfiguracionLimpiezaLogs) where?: Where<ConfiguracionLimpiezaLogs>,
  ): Promise<Count> {
    return this.configuracionLimpiezaLogsRepository.updateAll(configuracionLimpiezaLogs, where);
  }

  @get('/configuracion-limpieza-logs/{id}')
  @response(200, {
    description: 'ConfiguracionLimpiezaLogs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ConfiguracionLimpiezaLogs, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ConfiguracionLimpiezaLogs, {exclude: 'where'})
    filter?: FilterExcludingWhere<ConfiguracionLimpiezaLogs>,
  ): Promise<ConfiguracionLimpiezaLogs> {
    return this.configuracionLimpiezaLogsRepository.findById(id, filter);
  }

  @patch('/configuracion-limpieza-logs/{id}')
  @response(204, {
    description: 'ConfiguracionLimpiezaLogs PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ConfiguracionLimpiezaLogs, {partial: true}),
        },
      },
    })
    configuracionLimpiezaLogs: ConfiguracionLimpiezaLogs,
  ): Promise<void> {
    await this.configuracionLimpiezaLogsRepository.updateById(id, configuracionLimpiezaLogs);
  }

  @put('/configuracion-limpieza-logs/{id}')
  @response(204, {
    description: 'ConfiguracionLimpiezaLogs PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() configuracionLimpiezaLogs: ConfiguracionLimpiezaLogs,
  ): Promise<void> {
    await this.configuracionLimpiezaLogsRepository.replaceById(id, configuracionLimpiezaLogs);
  }

  @del('/configuracion-limpieza-logs/{id}')
  @response(204, {
    description: 'ConfiguracionLimpiezaLogs DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.configuracionLimpiezaLogsRepository.deleteById(id);
  }
}
