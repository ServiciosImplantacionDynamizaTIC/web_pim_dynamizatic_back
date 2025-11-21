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
import {GrupoAtributo} from '../models/grupo-atributo.model';
import {GrupoAtributoRepository} from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class GrupoAtributoController {
  constructor(
    @repository(GrupoAtributoRepository)
    public grupoAtributoRepository : GrupoAtributoRepository,
  ) {}

  @post('/grupo-atributos')
  @response(200, {
    description: 'GrupoAtributo model instance',
    content: {'application/json': {schema: getModelSchemaRef(GrupoAtributo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GrupoAtributo, {
            title: 'NewGrupoAtributo',
            exclude: ['id'],
          }),
        },
      },
    })
    grupoAtributo: Omit<GrupoAtributo, 'id'>,
  ): Promise<GrupoAtributo> {
    return this.grupoAtributoRepository.create(grupoAtributo);
  }

  @get('/grupo-atributos/count')
  @response(200, {
    description: 'GrupoAtributo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(GrupoAtributo) where?: Where<GrupoAtributo>,
  ): Promise<Count> {
    return SqlFilterUtil.ejecutarQueryCount(
      this.grupoAtributoRepository.dataSource,
      'grupo_atributo',
      where
    );
  }

  @get('/grupo-atributos')
  @response(200, {
    description: 'Array of GrupoAtributo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(GrupoAtributo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(GrupoAtributo) filter?: Filter<GrupoAtributo>,
  ): Promise<GrupoAtributo[]> {
    return SqlFilterUtil.ejecutarQuerySelect(
      this.grupoAtributoRepository.dataSource,
      'grupo_atributo',
      filter
    );
  }

  @patch('/grupo-atributos')
  @response(200, {
    description: 'GrupoAtributo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GrupoAtributo, {partial: true}),
        },
      },
    })
    grupoAtributo: GrupoAtributo,
    @param.where(GrupoAtributo) where?: Where<GrupoAtributo>,
  ): Promise<Count> {
    return this.grupoAtributoRepository.updateAll(grupoAtributo, where);
  }

  @get('/grupo-atributos/{id}')
  @response(200, {
    description: 'GrupoAtributo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GrupoAtributo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(GrupoAtributo, {exclude: 'where'}) filter?: FilterExcludingWhere<GrupoAtributo>
  ): Promise<GrupoAtributo> {
    return this.grupoAtributoRepository.findById(id, filter);
  }

  @patch('/grupo-atributos/{id}')
  @response(204, {
    description: 'GrupoAtributo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GrupoAtributo, {partial: true}),
        },
      },
    })
    grupoAtributo: GrupoAtributo,
  ): Promise<void> {
    await this.grupoAtributoRepository.updateById(id, grupoAtributo);
  }

  @put('/grupo-atributos/{id}')
  @response(204, {
    description: 'GrupoAtributo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() grupoAtributo: GrupoAtributo,
  ): Promise<void> {
    await this.grupoAtributoRepository.replaceById(id, grupoAtributo);
  }

  @del('/grupo-atributos/{id}')
  @response(204, {
    description: 'GrupoAtributo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.grupoAtributoRepository.deleteById(id);
  }
}

