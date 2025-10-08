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
    const dataSource = this.categoriaGrupoAtributoRepository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += ` WHERE 1=1`
    if (where) {
      for (const [key] of Object.entries(where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((where as any)[key])) {
              if (subValue !== '' && subValue != null) {
                if (!first) {
                  if (key === 'and') {
                    filtros += ` AND`;
                  }
                  else {
                    filtros += ` OR`;
                  }
                }
                else {
                  filtros += ' AND ('
                }
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  filtros += ` ${subKey} = ${subValue}`;
                }
                else {
                  filtros += ` ${subKey} LIKE '%${subValue}%'`;
                }
                first = false
              }
            }
            if (!first) {
              filtros += `)`;
            }
          }
        }

      }
    }
    const query = `SELECT COUNT(*) AS count FROM categoria_grupo_atributo${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
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
    return this.categoriaGrupoAtributoRepository.find(filter);
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
