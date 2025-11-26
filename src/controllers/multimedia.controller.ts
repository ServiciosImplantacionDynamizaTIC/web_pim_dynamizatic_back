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
import {Multimedia} from '../models/multimedia.model';
import {MultimediaRepository} from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class MultimediaController {
  constructor(
    @repository(MultimediaRepository)
    public multimediaRepository : MultimediaRepository,
  ) {}

  @post('/multimedias')
  @response(200, {
    description: 'Multimedia model instance',
    content: {'application/json': {schema: getModelSchemaRef(Multimedia)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Multimedia, {
            title: 'NewMultimedia',
            exclude: ['id'],
          }),
        },
      },
    })
    multimedia: Omit<Multimedia, 'id'>,
  ): Promise<Multimedia> {
    return this.multimediaRepository.create(multimedia);
  }

  @get('/multimedias/count')
  @response(200, {
    description: 'Multimedia model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Multimedia) where?: Where<Multimedia>,
  ): Promise<Count> {
    return SqlFilterUtil.ejecutarQueryCount(
      this.multimediaRepository.dataSource,
      'multimedia',
      where
    );
  }

  @get('/multimedias')
  @response(200, {
    description: 'Array of Multimedia model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Multimedia, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Multimedia) filter?: Filter<Multimedia>,
  ): Promise<Multimedia[]> {
    return SqlFilterUtil.ejecutarQuerySelect(
      this.multimediaRepository.dataSource,
      'multimedia',
      filter
    );
  }

  @patch('/multimedias')
  @response(200, {
    description: 'Multimedia PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Multimedia, {partial: true}),
        },
      },
    })
    multimedia: Multimedia,
    @param.where(Multimedia) where?: Where<Multimedia>,
  ): Promise<Count> {
    return this.multimediaRepository.updateAll(multimedia, where);
  }

  @get('/multimedias/{id}')
  @response(200, {
    description: 'Multimedia model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Multimedia, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Multimedia, {exclude: 'where'}) filter?: FilterExcludingWhere<Multimedia>
  ): Promise<Multimedia> {
    return this.multimediaRepository.findById(id, filter);
  }

  @patch('/multimedias/{id}')
  @response(204, {
    description: 'Multimedia PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Multimedia, {partial: true}),
        },
      },
    })
    multimedia: Multimedia,
  ): Promise<void> {
    await this.multimediaRepository.updateById(id, multimedia);
  }

  @put('/multimedias/{id}')
  @response(204, {
    description: 'Multimedia PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() multimedia: Multimedia,
  ): Promise<void> {
    await this.multimediaRepository.replaceById(id, multimedia);
  }

  @del('/multimedias/{id}')
  @response(204, {
    description: 'Multimedia DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.multimediaRepository.deleteById(id);
  }
}

