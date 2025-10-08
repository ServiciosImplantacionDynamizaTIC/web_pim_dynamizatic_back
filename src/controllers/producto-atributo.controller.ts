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
import {ProductoAtributo} from '../models/producto-atributo.model';
import {ProductoAtributoRepository} from '../repositories';

export class ProductoAtributoController {
  constructor(
    @repository(ProductoAtributoRepository)
    public productoAtributoRepository : ProductoAtributoRepository,
  ) {}

  @post('/producto-atributos')
  @response(200, {
    description: 'ProductoAtributo model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductoAtributo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoAtributo, {
            title: 'NewProductoAtributo',
            exclude: ['id'],
          }),
        },
      },
    })
    productoAtributo: Omit<ProductoAtributo, 'id'>,
  ): Promise<ProductoAtributo> {
    return this.productoAtributoRepository.create(productoAtributo);
  }

  @get('/producto-atributos/count')
  @response(200, {
    description: 'ProductoAtributo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductoAtributo) where?: Where<ProductoAtributo>,
  ): Promise<Count> {
    return this.productoAtributoRepository.count(where);
  }

  @get('/producto-atributos')
  @response(200, {
    description: 'Array of ProductoAtributo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductoAtributo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductoAtributo) filter?: Filter<ProductoAtributo>,
  ): Promise<ProductoAtributo[]> {
    return this.productoAtributoRepository.find(filter);
  }

  @patch('/producto-atributos')
  @response(200, {
    description: 'ProductoAtributo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoAtributo, {partial: true}),
        },
      },
    })
    productoAtributo: ProductoAtributo,
    @param.where(ProductoAtributo) where?: Where<ProductoAtributo>,
  ): Promise<Count> {
    return this.productoAtributoRepository.updateAll(productoAtributo, where);
  }

  @get('/producto-atributos/{id}')
  @response(200, {
    description: 'ProductoAtributo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductoAtributo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProductoAtributo, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductoAtributo>
  ): Promise<ProductoAtributo> {
    return this.productoAtributoRepository.findById(id, filter);
  }

  @patch('/producto-atributos/{id}')
  @response(204, {
    description: 'ProductoAtributo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoAtributo, {partial: true}),
        },
      },
    })
    productoAtributo: ProductoAtributo,
  ): Promise<void> {
    await this.productoAtributoRepository.updateById(id, productoAtributo);
  }

  @put('/producto-atributos/{id}')
  @response(204, {
    description: 'ProductoAtributo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productoAtributo: ProductoAtributo,
  ): Promise<void> {
    await this.productoAtributoRepository.replaceById(id, productoAtributo);
  }

  @del('/producto-atributos/{id}')
  @response(204, {
    description: 'ProductoAtributo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productoAtributoRepository.deleteById(id);
  }
}

