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
    const query = `SELECT COUNT(*) AS count FROM atributo${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
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
    const query = `SELECT * FROM atributo${filtros}`;
    const registros = await dataSource.execute(query);
    return registros;
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
