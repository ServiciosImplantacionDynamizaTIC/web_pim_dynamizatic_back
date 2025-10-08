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
import {ProductoIcono} from '../models/producto-icono.model';
import {ProductoIconoRepository} from '../repositories';

export class ProductoIconoController {
  constructor(
    @repository(ProductoIconoRepository)
    public productoIconoRepository : ProductoIconoRepository,
  ) {}

  @post('/producto-iconos')
  @response(200, {
    description: 'ProductoIcono model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductoIcono)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoIcono, {
            title: 'NewProductoIcono',
            exclude: ['id'],
          }),
        },
      },
    })
    productoIcono: Omit<ProductoIcono, 'id'>,
  ): Promise<ProductoIcono> {
    return this.productoIconoRepository.create(productoIcono);
  }

  @get('/producto-iconos/count')
  @response(200, {
    description: 'ProductoIcono model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductoIcono) where?: Where<ProductoIcono>,
  ): Promise<Count> {
    return this.productoIconoRepository.count(where);
  }

  @get('/producto-iconos')
  @response(200, {
    description: 'Array of ProductoIcono model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductoIcono, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductoIcono) filter?: Filter<ProductoIcono>,
  ): Promise<ProductoIcono[]> {
    return this.productoIconoRepository.find(filter);
  }

  @patch('/producto-iconos')
  @response(200, {
    description: 'ProductoIcono PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoIcono, {partial: true}),
        },
      },
    })
    productoIcono: ProductoIcono,
    @param.where(ProductoIcono) where?: Where<ProductoIcono>,
  ): Promise<Count> {
    return this.productoIconoRepository.updateAll(productoIcono, where);
  }

  @get('/producto-iconos/{id}')
  @response(200, {
    description: 'ProductoIcono model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductoIcono, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProductoIcono, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductoIcono>
  ): Promise<ProductoIcono> {
    return this.productoIconoRepository.findById(id, filter);
  }

  @patch('/producto-iconos/{id}')
  @response(204, {
    description: 'ProductoIcono PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoIcono, {partial: true}),
        },
      },
    })
    productoIcono: ProductoIcono,
  ): Promise<void> {
    await this.productoIconoRepository.updateById(id, productoIcono);
  }

  @put('/producto-iconos/{id}')
  @response(204, {
    description: 'ProductoIcono PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productoIcono: ProductoIcono,
  ): Promise<void> {
    await this.productoIconoRepository.replaceById(id, productoIcono);
  }

  @del('/producto-iconos/{id}')
  @response(204, {
    description: 'ProductoIcono DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productoIconoRepository.deleteById(id);
  }
}

