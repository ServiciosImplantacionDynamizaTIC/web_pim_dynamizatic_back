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
import {ProductoCampoDinamico} from '../models/producto-campo-dinamico.model';
import {ProductoCampoDinamicoRepository} from '../repositories';

export class ProductoCampoDinamicoController {
  constructor(
    @repository(ProductoCampoDinamicoRepository)
    public productoCampoDinamicoRepository : ProductoCampoDinamicoRepository,
  ) {}

  @post('/producto-campo-dinamicos')
  @response(200, {
    description: 'ProductoCampoDinamico model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductoCampoDinamico)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoCampoDinamico, {
            title: 'NewProductoCampoDinamico',
            exclude: ['id'],
          }),
        },
      },
    })
    productoCampoDinamico: Omit<ProductoCampoDinamico, 'id'>,
  ): Promise<ProductoCampoDinamico> {
    return this.productoCampoDinamicoRepository.create(productoCampoDinamico);
  }

  @get('/producto-campo-dinamicos/count')
  @response(200, {
    description: 'ProductoCampoDinamico model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductoCampoDinamico) where?: Where<ProductoCampoDinamico>,
  ): Promise<Count> {
    return this.productoCampoDinamicoRepository.count(where);
  }

  @get('/producto-campo-dinamicos')
  @response(200, {
    description: 'Array of ProductoCampoDinamico model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductoCampoDinamico, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductoCampoDinamico) filter?: Filter<ProductoCampoDinamico>,
  ): Promise<ProductoCampoDinamico[]> {
    return this.productoCampoDinamicoRepository.find(filter);
  }

  @patch('/producto-campo-dinamicos')
  @response(200, {
    description: 'ProductoCampoDinamico PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoCampoDinamico, {partial: true}),
        },
      },
    })
    productoCampoDinamico: ProductoCampoDinamico,
    @param.where(ProductoCampoDinamico) where?: Where<ProductoCampoDinamico>,
  ): Promise<Count> {
    return this.productoCampoDinamicoRepository.updateAll(productoCampoDinamico, where);
  }

  @get('/producto-campo-dinamicos/{id}')
  @response(200, {
    description: 'ProductoCampoDinamico model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductoCampoDinamico, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProductoCampoDinamico, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductoCampoDinamico>
  ): Promise<ProductoCampoDinamico> {
    return this.productoCampoDinamicoRepository.findById(id, filter);
  }

  @patch('/producto-campo-dinamicos/{id}')
  @response(204, {
    description: 'ProductoCampoDinamico PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoCampoDinamico, {partial: true}),
        },
      },
    })
    productoCampoDinamico: ProductoCampoDinamico,
  ): Promise<void> {
    await this.productoCampoDinamicoRepository.updateById(id, productoCampoDinamico);
  }

  @put('/producto-campo-dinamicos/{id}')
  @response(204, {
    description: 'ProductoCampoDinamico PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productoCampoDinamico: ProductoCampoDinamico,
  ): Promise<void> {
    await this.productoCampoDinamicoRepository.replaceById(id, productoCampoDinamico);
  }

  @del('/producto-campo-dinamicos/{id}')
  @response(204, {
    description: 'ProductoCampoDinamico DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productoCampoDinamicoRepository.deleteById(id);
  }
}

