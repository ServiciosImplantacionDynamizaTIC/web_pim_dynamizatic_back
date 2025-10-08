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
import {TraduccionLiteral} from '../models/traduccion-literal.model';
import {TraduccionLiteralRepository} from '../repositories';

export class TraduccionLiteralController {
  constructor(
    @repository(TraduccionLiteralRepository)
    public traduccionLiteralRepository : TraduccionLiteralRepository,
  ) {}

  @post('/traduccion-literals')
  @response(200, {
    description: 'TraduccionLiteral model instance',
    content: {'application/json': {schema: getModelSchemaRef(TraduccionLiteral)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionLiteral, {
            title: 'NewTraduccionLiteral',
            exclude: ['id'],
          }),
        },
      },
    })
    traduccionLiteral: Omit<TraduccionLiteral, 'id'>,
  ): Promise<TraduccionLiteral> {
    return this.traduccionLiteralRepository.create(traduccionLiteral);
  }

  @get('/traduccion-literals/count')
  @response(200, {
    description: 'TraduccionLiteral model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TraduccionLiteral) where?: Where<TraduccionLiteral>,
  ): Promise<Count> {
    return this.traduccionLiteralRepository.count(where);
  }

  @get('/traduccion-literals')
  @response(200, {
    description: 'Array of TraduccionLiteral model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TraduccionLiteral, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TraduccionLiteral) filter?: Filter<TraduccionLiteral>,
  ): Promise<TraduccionLiteral[]> {
    return this.traduccionLiteralRepository.find(filter);
  }

  @patch('/traduccion-literals')
  @response(200, {
    description: 'TraduccionLiteral PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionLiteral, {partial: true}),
        },
      },
    })
    traduccionLiteral: TraduccionLiteral,
    @param.where(TraduccionLiteral) where?: Where<TraduccionLiteral>,
  ): Promise<Count> {
    return this.traduccionLiteralRepository.updateAll(traduccionLiteral, where);
  }

  @get('/traduccion-literals/{id}')
  @response(200, {
    description: 'TraduccionLiteral model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TraduccionLiteral, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TraduccionLiteral, {exclude: 'where'}) filter?: FilterExcludingWhere<TraduccionLiteral>
  ): Promise<TraduccionLiteral> {
    return this.traduccionLiteralRepository.findById(id, filter);
  }

  @patch('/traduccion-literals/{id}')
  @response(204, {
    description: 'TraduccionLiteral PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionLiteral, {partial: true}),
        },
      },
    })
    traduccionLiteral: TraduccionLiteral,
  ): Promise<void> {
    await this.traduccionLiteralRepository.updateById(id, traduccionLiteral);
  }

  @put('/traduccion-literals/{id}')
  @response(204, {
    description: 'TraduccionLiteral PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() traduccionLiteral: TraduccionLiteral,
  ): Promise<void> {
    await this.traduccionLiteralRepository.replaceById(id, traduccionLiteral);
  }

  @del('/traduccion-literals/{id}')
  @response(204, {
    description: 'TraduccionLiteral DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.traduccionLiteralRepository.deleteById(id);
  }
}

