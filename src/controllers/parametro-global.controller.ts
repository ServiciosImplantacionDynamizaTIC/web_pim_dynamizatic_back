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
import {ParametroGlobal} from '../models/parametro-global.model';
import {ParametroGlobalRepository} from '../repositories';

export class ParametroGlobalController {
  constructor(
    @repository(ParametroGlobalRepository)
    public parametroGlobalRepository : ParametroGlobalRepository,
  ) {}

  @post('/parametro-globals')
  @response(200, {
    description: 'ParametroGlobal model instance',
    content: {'application/json': {schema: getModelSchemaRef(ParametroGlobal)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParametroGlobal, {
            title: 'NewParametroGlobal',
            exclude: ['id'],
          }),
        },
      },
    })
    parametroGlobal: Omit<ParametroGlobal, 'id'>,
  ): Promise<ParametroGlobal> {
    return this.parametroGlobalRepository.create(parametroGlobal);
  }

  @get('/parametro-globals/count')
  @response(200, {
    description: 'ParametroGlobal model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ParametroGlobal) where?: Where<ParametroGlobal>,
  ): Promise<Count> {
    return this.parametroGlobalRepository.count(where);
  }

  @get('/parametro-globals')
  @response(200, {
    description: 'Array of ParametroGlobal model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ParametroGlobal, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ParametroGlobal) filter?: Filter<ParametroGlobal>,
  ): Promise<ParametroGlobal[]> {
    return this.parametroGlobalRepository.find(filter);
  }

  @patch('/parametro-globals')
  @response(200, {
    description: 'ParametroGlobal PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParametroGlobal, {partial: true}),
        },
      },
    })
    parametroGlobal: ParametroGlobal,
    @param.where(ParametroGlobal) where?: Where<ParametroGlobal>,
  ): Promise<Count> {
    return this.parametroGlobalRepository.updateAll(parametroGlobal, where);
  }

  @get('/parametro-globals/{id}')
  @response(200, {
    description: 'ParametroGlobal model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ParametroGlobal, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ParametroGlobal, {exclude: 'where'}) filter?: FilterExcludingWhere<ParametroGlobal>
  ): Promise<ParametroGlobal> {
    return this.parametroGlobalRepository.findById(id, filter);
  }

  @patch('/parametro-globals/{id}')
  @response(204, {
    description: 'ParametroGlobal PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParametroGlobal, {partial: true}),
        },
      },
    })
    parametroGlobal: ParametroGlobal,
  ): Promise<void> {
    await this.parametroGlobalRepository.updateById(id, parametroGlobal);
  }

  @put('/parametro-globals/{id}')
  @response(204, {
    description: 'ParametroGlobal PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() parametroGlobal: ParametroGlobal,
  ): Promise<void> {
    await this.parametroGlobalRepository.replaceById(id, parametroGlobal);
  }

  @del('/parametro-globals/{id}')
  @response(204, {
    description: 'ParametroGlobal DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.parametroGlobalRepository.deleteById(id);
  }
}

