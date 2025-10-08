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
    const dataSource = this.grupoAtributoRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM grupo_atributo${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
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
    const dataSource = this.grupoAtributoRepository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += ` WHERE 1=1`
    if (filter?.where) {
      for (const [key] of Object.entries(filter?.where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((filter?.where as any)[key])) {
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
    // Agregar ordenamiento
    if (filter?.order) {
      filtros += ` ORDER BY ${filter.order}`;
    }
    // Agregar paginación
    if (filter?.limit) {
      filtros += ` LIMIT ${filter?.limit}`;
    }
    if (filter?.offset) {
      filtros += ` OFFSET ${filter?.offset}`;
    }
    const query = `SELECT * FROM grupo_atributo${filtros}`;
    const registros = await dataSource.execute(query);
    return registros;
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

