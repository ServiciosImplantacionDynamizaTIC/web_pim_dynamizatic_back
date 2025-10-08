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
import {ProductoMultimedia} from '../models/producto-multimedia.model';
import {ProductoMultimediaRepository} from '../repositories';

export class ProductoMultimediaController {
  constructor(
    @repository(ProductoMultimediaRepository)
    public productoMultimediaRepository : ProductoMultimediaRepository,
  ) {}

  @post('/producto-multimedias')
  @response(200, {
    description: 'ProductoMultimedia model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductoMultimedia)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoMultimedia, {
            title: 'NewProductoMultimedia',
            exclude: ['id'],
          }),
        },
      },
    })
    productoMultimedia: Omit<ProductoMultimedia, 'id'>,
  ): Promise<ProductoMultimedia> {
    return this.productoMultimediaRepository.create(productoMultimedia);
  }

  @get('/producto-multimedias/count')
  @response(200, {
    description: 'ProductoMultimedia model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductoMultimedia) where?: Where<ProductoMultimedia>,
  ): Promise<Count> {
    return this.productoMultimediaRepository.count(where);
  }

  @get('/producto-multimedias')
  @response(200, {
    description: 'Array of ProductoMultimedia model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductoMultimedia, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductoMultimedia) filter?: Filter<ProductoMultimedia>,
  ): Promise<ProductoMultimedia[]> {
    return this.productoMultimediaRepository.find(filter);
  }

  @patch('/producto-multimedias')
  @response(200, {
    description: 'ProductoMultimedia PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoMultimedia, {partial: true}),
        },
      },
    })
    productoMultimedia: ProductoMultimedia,
    @param.where(ProductoMultimedia) where?: Where<ProductoMultimedia>,
  ): Promise<Count> {
    return this.productoMultimediaRepository.updateAll(productoMultimedia, where);
  }

  @get('/producto-multimedias/{id}')
  @response(200, {
    description: 'ProductoMultimedia model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductoMultimedia, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProductoMultimedia, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductoMultimedia>
  ): Promise<ProductoMultimedia> {
    return this.productoMultimediaRepository.findById(id, filter);
  }

  @patch('/producto-multimedias/{id}')
  @response(204, {
    description: 'ProductoMultimedia PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoMultimedia, {partial: true}),
        },
      },
    })
    productoMultimedia: ProductoMultimedia,
  ): Promise<void> {
    await this.productoMultimediaRepository.updateById(id, productoMultimedia);
  }

  @put('/producto-multimedias/{id}')
  @response(204, {
    description: 'ProductoMultimedia PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productoMultimedia: ProductoMultimedia,
  ): Promise<void> {
    await this.productoMultimediaRepository.replaceById(id, productoMultimedia);
  }

  @del('/producto-multimedias/{id}')
  @response(204, {
    description: 'ProductoMultimedia DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productoMultimediaRepository.deleteById(id);
  }
}

