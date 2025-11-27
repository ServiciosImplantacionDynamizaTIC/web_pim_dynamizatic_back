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
import {Marketplace} from '../models/marketplace.model';
import {MarketplaceRepository} from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class MarketplaceController {
  constructor(
    @repository(MarketplaceRepository)
    public marketplaceRepository : MarketplaceRepository,
  ) {}

  @post('/marketplaces')
  @response(200, {
    description: 'Marketplace model instance',
    content: {'application/json': {schema: getModelSchemaRef(Marketplace)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Marketplace, {
            title: 'NewMarketplace',
            exclude: ['id'],
          }),
        },
      },
    })
    marketplace: Omit<Marketplace, 'id'>,
  ): Promise<Marketplace> {
    return this.marketplaceRepository.create(marketplace);
  }

  @get('/marketplaces/count')
  @response(200, {
    description: 'Marketplace model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Marketplace) where?: Where<Marketplace>,
  ): Promise<Count> {
    return SqlFilterUtil.ejecutarQueryCount(
      this.marketplaceRepository.dataSource,
      'marketplace',
      where
    );
  }

  @get('/marketplaces')
  @response(200, {
    description: 'Array of Marketplace model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Marketplace, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Marketplace) filter?: Filter<Marketplace>,
  ): Promise<Marketplace[]> {
    return SqlFilterUtil.ejecutarQuerySelect(
      this.marketplaceRepository.dataSource,
      'marketplace',
      filter
    );
  }

  @patch('/marketplaces')
  @response(200, {
    description: 'Marketplace PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Marketplace, {partial: true}),
        },
      },
    })
    marketplace: Marketplace,
    @param.where(Marketplace) where?: Where<Marketplace>,
  ): Promise<Count> {
    return this.marketplaceRepository.updateAll(marketplace, where);
  }

  @get('/marketplaces/{id}')
  @response(200, {
    description: 'Marketplace model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Marketplace, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Marketplace, {exclude: 'where'}) filter?: FilterExcludingWhere<Marketplace>
  ): Promise<Marketplace> {
    return this.marketplaceRepository.findById(id, filter);
  }

  @patch('/marketplaces/{id}')
  @response(204, {
    description: 'Marketplace PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Marketplace, {partial: true}),
        },
      },
    })
    marketplace: Marketplace,
  ): Promise<void> {
    await this.marketplaceRepository.updateById(id, marketplace);
  }

  @put('/marketplaces/{id}')
  @response(204, {
    description: 'Marketplace PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() marketplace: Marketplace,
  ): Promise<void> {
    await this.marketplaceRepository.replaceById(id, marketplace);
  }

  @del('/marketplaces/{id}')
  @response(204, {
    description: 'Marketplace DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.marketplaceRepository.deleteById(id);
  }
}

