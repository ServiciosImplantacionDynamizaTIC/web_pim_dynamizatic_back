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
import {ProductoMarketplace} from '../models/producto-marketplace.model';
import {ProductoMarketplaceRepository} from '../repositories';

export class ProductoMarketplaceController {
  constructor(
    @repository(ProductoMarketplaceRepository)
    public productoMarketplaceRepository : ProductoMarketplaceRepository,
  ) {}

  @post('/producto-marketplaces')
  @response(200, {
    description: 'ProductoMarketplace model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductoMarketplace)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoMarketplace, {
            title: 'NewProductoMarketplace',
            exclude: ['id'],
          }),
        },
      },
    })
    productoMarketplace: Omit<ProductoMarketplace, 'id'>,
  ): Promise<ProductoMarketplace> {
    return this.productoMarketplaceRepository.create(productoMarketplace);
  }

  @get('/producto-marketplaces/count')
  @response(200, {
    description: 'ProductoMarketplace model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductoMarketplace) where?: Where<ProductoMarketplace>,
  ): Promise<Count> {
    return this.productoMarketplaceRepository.count(where);
  }

  @get('/producto-marketplaces')
  @response(200, {
    description: 'Array of ProductoMarketplace model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductoMarketplace, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductoMarketplace) filter?: Filter<ProductoMarketplace>,
  ): Promise<ProductoMarketplace[]> {
    return this.productoMarketplaceRepository.find(filter);
  }

  @patch('/producto-marketplaces')
  @response(200, {
    description: 'ProductoMarketplace PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoMarketplace, {partial: true}),
        },
      },
    })
    productoMarketplace: ProductoMarketplace,
    @param.where(ProductoMarketplace) where?: Where<ProductoMarketplace>,
  ): Promise<Count> {
    return this.productoMarketplaceRepository.updateAll(productoMarketplace, where);
  }

  @get('/producto-marketplaces/{id}')
  @response(200, {
    description: 'ProductoMarketplace model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductoMarketplace, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProductoMarketplace, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductoMarketplace>
  ): Promise<ProductoMarketplace> {
    return this.productoMarketplaceRepository.findById(id, filter);
  }

  @patch('/producto-marketplaces/{id}')
  @response(204, {
    description: 'ProductoMarketplace PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoMarketplace, {partial: true}),
        },
      },
    })
    productoMarketplace: ProductoMarketplace,
  ): Promise<void> {
    await this.productoMarketplaceRepository.updateById(id, productoMarketplace);
  }

  @put('/producto-marketplaces/{id}')
  @response(204, {
    description: 'ProductoMarketplace PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productoMarketplace: ProductoMarketplace,
  ): Promise<void> {
    await this.productoMarketplaceRepository.replaceById(id, productoMarketplace);
  }

  @del('/producto-marketplaces/{id}')
  @response(204, {
    description: 'ProductoMarketplace DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productoMarketplaceRepository.deleteById(id);
  }
}

