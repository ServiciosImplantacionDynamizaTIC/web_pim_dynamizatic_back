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
import {Atributo} from '../models/atributo.model';
import {AtributoRepository} from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class AtributoController {
  constructor(
    @repository(AtributoRepository)
    public atributoRepository : AtributoRepository,
  ) {}

  @post('/atributos')
  @response(200, {
    description: 'Atributo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Atributo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Atributo, {
            title: 'NewAtributo',
            exclude: ['id'],
          }),
        },
      },
    })
    atributo: Omit<Atributo, 'id'>,
  ): Promise<Atributo> {
    return this.atributoRepository.create(atributo);
  }

  @get('/atributos/count')
  @response(200, {
    description: 'Atributo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Atributo) where?: Where<Atributo>,
  ): Promise<Count> {
    const dataSource = this.atributoRepository.dataSource;
    return await SqlFilterUtil.ejecutarQueryCount(dataSource, 'atributo', where);        
  }

  @get('/atributos')
  @response(200, {
    description: 'Array of Atributo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Atributo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Atributo) filter?: Filter<Atributo>,
  ): Promise<Atributo[]> {
    const dataSource = this.atributoRepository.dataSource;
    const camposSelect = "*"
    return await SqlFilterUtil.ejecutarQuerySelect(dataSource, 'vista_grupo_atributo_atributo', filter, camposSelect);
  }

  @patch('/atributos')
  @response(200, {
    description: 'Atributo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Atributo, {partial: true}),
        },
      },
    })
    atributo: Atributo,
    @param.where(Atributo) where?: Where<Atributo>,
  ): Promise<Count> {
    return this.atributoRepository.updateAll(atributo, where);
  }

  @get('/atributos/{id}')
  @response(200, {
    description: 'Atributo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Atributo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Atributo, {exclude: 'where'}) filter?: FilterExcludingWhere<Atributo>
  ): Promise<Atributo> {
    return this.atributoRepository.findById(id, filter);
  }

  @patch('/atributos/{id}')
  @response(204, {
    description: 'Atributo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Atributo, {partial: true}),
        },
      },
    })
    atributo: Atributo,
  ): Promise<void> {
    await this.atributoRepository.updateById(id, atributo);
  }

  @put('/atributos/{id}')
  @response(204, {
    description: 'Atributo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() atributo: Atributo,
  ): Promise<void> {
    await this.atributoRepository.replaceById(id, atributo);
  }

  @del('/atributos/{id}')
  @response(204, {
    description: 'Atributo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.atributoRepository.deleteById(id);
  }
}
