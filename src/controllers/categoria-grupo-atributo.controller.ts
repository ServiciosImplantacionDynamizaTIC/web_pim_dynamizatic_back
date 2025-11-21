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
import {CategoriaGrupoAtributo} from '../models/categoria-grupo-atributo.model';
import {CategoriaGrupoAtributoRepository} from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class CategoriaGrupoAtributoController {
  constructor(
    @repository(CategoriaGrupoAtributoRepository)
    public categoriaGrupoAtributoRepository : CategoriaGrupoAtributoRepository,
  ) {}

  @post('/categoria-grupo-atributos')
  @response(200, {
    description: 'CategoriaGrupoAtributo model instance',
    content: {'application/json': {schema: getModelSchemaRef(CategoriaGrupoAtributo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoriaGrupoAtributo, {
            title: 'NewCategoriaGrupoAtributo',
            exclude: ['id'],
          }),
        },
      },
    })
    categoriaGrupoAtributo: Omit<CategoriaGrupoAtributo, 'id'>,
  ): Promise<CategoriaGrupoAtributo> {
    return this.categoriaGrupoAtributoRepository.create(categoriaGrupoAtributo);
  }

  @get('/categoria-grupo-atributos/count')
  @response(200, {
    description: 'CategoriaGrupoAtributo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CategoriaGrupoAtributo) where?: Where<CategoriaGrupoAtributo>,
  ): Promise<Count> {
    return SqlFilterUtil.ejecutarQueryCount(
      this.categoriaGrupoAtributoRepository.dataSource,
      'categoria_grupo_atributo',
      where
    );
  }

  @get('/categoria-grupo-atributos')
  @response(200, {
    description: 'Array of CategoriaGrupoAtributo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CategoriaGrupoAtributo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CategoriaGrupoAtributo) filter?: Filter<CategoriaGrupoAtributo>,
  ): Promise<CategoriaGrupoAtributo[]> {
    return SqlFilterUtil.ejecutarQuerySelect(
      this.categoriaGrupoAtributoRepository.dataSource,
      'categoria_grupo_atributo',
      filter
    );
  }

  @patch('/categoria-grupo-atributos')
  @response(200, {
    description: 'CategoriaGrupoAtributo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoriaGrupoAtributo, {partial: true}),
        },
      },
    })
    categoriaGrupoAtributo: CategoriaGrupoAtributo,
    @param.where(CategoriaGrupoAtributo) where?: Where<CategoriaGrupoAtributo>,
  ): Promise<Count> {
    return this.categoriaGrupoAtributoRepository.updateAll(categoriaGrupoAtributo, where);
  }

  @get('/categoria-grupo-atributos/{id}')
  @response(200, {
    description: 'CategoriaGrupoAtributo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CategoriaGrupoAtributo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CategoriaGrupoAtributo, {exclude: 'where'}) filter?: FilterExcludingWhere<CategoriaGrupoAtributo>
  ): Promise<CategoriaGrupoAtributo> {
    return this.categoriaGrupoAtributoRepository.findById(id, filter);
  }

  @patch('/categoria-grupo-atributos/{id}')
  @response(204, {
    description: 'CategoriaGrupoAtributo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoriaGrupoAtributo, {partial: true}),
        },
      },
    })
    categoriaGrupoAtributo: CategoriaGrupoAtributo,
  ): Promise<void> {
    await this.categoriaGrupoAtributoRepository.updateById(id, categoriaGrupoAtributo);
  }

  @put('/categoria-grupo-atributos/{id}')
  @response(204, {
    description: 'CategoriaGrupoAtributo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() categoriaGrupoAtributo: CategoriaGrupoAtributo,
  ): Promise<void> {
    await this.categoriaGrupoAtributoRepository.replaceById(id, categoriaGrupoAtributo);
  }

  @del('/categoria-grupo-atributos/{id}')
  @response(204, {
    description: 'CategoriaGrupoAtributo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.categoriaGrupoAtributoRepository.deleteById(id);
  }
}
