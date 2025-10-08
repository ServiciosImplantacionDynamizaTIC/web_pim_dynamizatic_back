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
import {MensajeTipo} from '../models';
import {MensajeTipoRepository} from '../repositories';

export class MensajeTipoController {
  constructor(
    @repository(MensajeTipoRepository)
    public mensajeTipoRepository : MensajeTipoRepository,
  ) {}

  @post('/mensaje-tipos')
  @response(200, {
    description: 'MensajeTipo model instance',
    content: {'application/json': {schema: getModelSchemaRef(MensajeTipo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajeTipo, {
            title: 'NewMensajeTipo',
            exclude: ['id'],
          }),
        },
      },
    })
    mensajeTipo: Omit<MensajeTipo, 'id'>,
  ): Promise<MensajeTipo> {
    return this.mensajeTipoRepository.create(mensajeTipo);
  }

  @get('/mensaje-tipos/count')
  @response(200, {
    description: 'MensajeTipo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MensajeTipo) where?: Where<MensajeTipo>,
  ): Promise<Count> {
    return this.mensajeTipoRepository.count(where);
  }

  @get('/mensaje-tipos')
  @response(200, {
    description: 'Array of MensajeTipo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MensajeTipo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MensajeTipo) filter?: Filter<MensajeTipo>,
  ): Promise<MensajeTipo[]> {
    return this.mensajeTipoRepository.find(filter);
  }

  @patch('/mensaje-tipos')
  @response(200, {
    description: 'MensajeTipo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajeTipo, {partial: true}),
        },
      },
    })
    mensajeTipo: MensajeTipo,
    @param.where(MensajeTipo) where?: Where<MensajeTipo>,
  ): Promise<Count> {
    return this.mensajeTipoRepository.updateAll(mensajeTipo, where);
  }

  @get('/mensaje-tipos/{id}')
  @response(200, {
    description: 'MensajeTipo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MensajeTipo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MensajeTipo, {exclude: 'where'}) filter?: FilterExcludingWhere<MensajeTipo>
  ): Promise<MensajeTipo> {
    return this.mensajeTipoRepository.findById(id, filter);
  }

  @patch('/mensaje-tipos/{id}')
  @response(204, {
    description: 'MensajeTipo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajeTipo, {partial: true}),
        },
      },
    })
    mensajeTipo: MensajeTipo,
  ): Promise<void> {
    await this.mensajeTipoRepository.updateById(id, mensajeTipo);
  }

  @put('/mensaje-tipos/{id}')
  @response(204, {
    description: 'MensajeTipo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() mensajeTipo: MensajeTipo,
  ): Promise<void> {
    await this.mensajeTipoRepository.replaceById(id, mensajeTipo);
  }

  @del('/mensaje-tipos/{id}')
  @response(204, {
    description: 'MensajeTipo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.mensajeTipoRepository.deleteById(id);
  }
}

