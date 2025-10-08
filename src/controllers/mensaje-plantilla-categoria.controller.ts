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
import {MensajePlantillaCategoria} from '../models';
import {MensajePlantillaCategoriaRepository} from '../repositories';

export class MensajePlantillaCategoriaController {
  constructor(
    @repository(MensajePlantillaCategoriaRepository)
    public mensajePlantillaCategoriaRepository : MensajePlantillaCategoriaRepository,
  ) {}

  @post('/mensaje-plantilla-categorias')
  @response(200, {
    description: 'MensajePlantillaCategoria model instance',
    content: {'application/json': {schema: getModelSchemaRef(MensajePlantillaCategoria)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajePlantillaCategoria, {
            title: 'NewMensajePlantillaCategoria',
            exclude: ['id'],
          }),
        },
      },
    })
    mensajePlantillaCategoria: Omit<MensajePlantillaCategoria, 'id'>,
  ): Promise<MensajePlantillaCategoria> {
    return this.mensajePlantillaCategoriaRepository.create(mensajePlantillaCategoria);
  }

  @get('/mensaje-plantilla-categorias/count')
  @response(200, {
    description: 'MensajePlantillaCategoria model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MensajePlantillaCategoria) where?: Where<MensajePlantillaCategoria>,
  ): Promise<Count> {
    return this.mensajePlantillaCategoriaRepository.count(where);
  }

  @get('/mensaje-plantilla-categorias')
  @response(200, {
    description: 'Array of MensajePlantillaCategoria model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MensajePlantillaCategoria, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MensajePlantillaCategoria) filter?: Filter<MensajePlantillaCategoria>,
  ): Promise<MensajePlantillaCategoria[]> {
    return this.mensajePlantillaCategoriaRepository.find(filter);
  }

  @patch('/mensaje-plantilla-categorias')
  @response(200, {
    description: 'MensajePlantillaCategoria PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajePlantillaCategoria, {partial: true}),
        },
      },
    })
    mensajePlantillaCategoria: MensajePlantillaCategoria,
    @param.where(MensajePlantillaCategoria) where?: Where<MensajePlantillaCategoria>,
  ): Promise<Count> {
    return this.mensajePlantillaCategoriaRepository.updateAll(mensajePlantillaCategoria, where);
  }

  @get('/mensaje-plantilla-categorias/{id}')
  @response(200, {
    description: 'MensajePlantillaCategoria model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MensajePlantillaCategoria, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MensajePlantillaCategoria, {exclude: 'where'}) filter?: FilterExcludingWhere<MensajePlantillaCategoria>
  ): Promise<MensajePlantillaCategoria> {
    return this.mensajePlantillaCategoriaRepository.findById(id, filter);
  }

  @patch('/mensaje-plantilla-categorias/{id}')
  @response(204, {
    description: 'MensajePlantillaCategoria PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajePlantillaCategoria, {partial: true}),
        },
      },
    })
    mensajePlantillaCategoria: MensajePlantillaCategoria,
  ): Promise<void> {
    await this.mensajePlantillaCategoriaRepository.updateById(id, mensajePlantillaCategoria);
  }

  @put('/mensaje-plantilla-categorias/{id}')
  @response(204, {
    description: 'MensajePlantillaCategoria PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() mensajePlantillaCategoria: MensajePlantillaCategoria,
  ): Promise<void> {
    await this.mensajePlantillaCategoriaRepository.replaceById(id, mensajePlantillaCategoria);
  }

  @del('/mensaje-plantilla-categorias/{id}')
  @response(204, {
    description: 'MensajePlantillaCategoria DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.mensajePlantillaCategoriaRepository.deleteById(id);
  }
}

