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
import {TraduccionContenido} from '../models/traduccion-contenido.model';
import {TraduccionContenidoRepository} from '../repositories';

export class TraduccionContenidoController {
  constructor(
    @repository(TraduccionContenidoRepository)
    public traduccionContenidoRepository : TraduccionContenidoRepository,
  ) {}

  @post('/traduccion-contenidos')
  @response(200, {
    description: 'TraduccionContenido model instance',
    content: {'application/json': {schema: getModelSchemaRef(TraduccionContenido)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionContenido, {
            title: 'NewTraduccionContenido',
            exclude: ['id'],
          }),
        },
      },
    })
    traduccionContenido: Omit<TraduccionContenido, 'id'>,
  ): Promise<TraduccionContenido> {
    return this.traduccionContenidoRepository.create(traduccionContenido);
  }

  @get('/traduccion-contenidos/count')
  @response(200, {
    description: 'TraduccionContenido model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TraduccionContenido) where?: Where<TraduccionContenido>,
  ): Promise<Count> {
    return this.traduccionContenidoRepository.count(where);
  }

  @get('/traduccion-contenidos')
  @response(200, {
    description: 'Array of TraduccionContenido model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TraduccionContenido, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TraduccionContenido) filter?: Filter<TraduccionContenido>,
  ): Promise<TraduccionContenido[]> {
    return this.traduccionContenidoRepository.find(filter);
  }

  @patch('/traduccion-contenidos')
  @response(200, {
    description: 'TraduccionContenido PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionContenido, {partial: true}),
        },
      },
    })
    traduccionContenido: TraduccionContenido,
    @param.where(TraduccionContenido) where?: Where<TraduccionContenido>,
  ): Promise<Count> {
    return this.traduccionContenidoRepository.updateAll(traduccionContenido, where);
  }

  @get('/traduccion-contenidos/{id}')
  @response(200, {
    description: 'TraduccionContenido model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TraduccionContenido, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TraduccionContenido, {exclude: 'where'}) filter?: FilterExcludingWhere<TraduccionContenido>
  ): Promise<TraduccionContenido> {
    return this.traduccionContenidoRepository.findById(id, filter);
  }

  @patch('/traduccion-contenidos/{id}')
  @response(204, {
    description: 'TraduccionContenido PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionContenido, {partial: true}),
        },
      },
    })
    traduccionContenido: TraduccionContenido,
  ): Promise<void> {
    await this.traduccionContenidoRepository.updateById(id, traduccionContenido);
  }

  @put('/traduccion-contenidos/{id}')
  @response(204, {
    description: 'TraduccionContenido PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() traduccionContenido: TraduccionContenido,
  ): Promise<void> {
    await this.traduccionContenidoRepository.replaceById(id, traduccionContenido);
  }

  @del('/traduccion-contenidos/{id}')
  @response(204, {
    description: 'TraduccionContenido DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.traduccionContenidoRepository.deleteById(id);
  }
}

