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
import {Categoria} from '../models/categoria.model';
import {CategoriaRepository} from '../repositories';

export class CategoriaController {
  constructor(
    @repository(CategoriaRepository)
    public categoriaRepository : CategoriaRepository,
  ) {}

  @post('/categorias')
  @response(200, {
    description: 'Categoria model instance',
    content: {'application/json': {schema: getModelSchemaRef(Categoria)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categoria, {
            title: 'NewCategoria',
            exclude: ['id'],
          }),
        },
      },
    })
    categoria: Omit<Categoria, 'id'>,
  ): Promise<Categoria> {
    return this.categoriaRepository.create(categoria);
  }

  @get('/categorias/count')
  @response(200, {
    description: 'Categoria model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Categoria) where?: Where<Categoria>,
  ): Promise<Count> {
    const dataSource = this.categoriaRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM categoria${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @get('/categorias')
  @response(200, {
    description: 'Array of Categoria model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Categoria, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Categoria) filter?: Filter<Categoria>,
  ): Promise<Categoria[]> {
    const dataSource = this.categoriaRepository.dataSource;
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
    const query = `SELECT * FROM categoria${filtros}`;
    const registros = await dataSource.execute(query);
    return registros;
  }

  @patch('/categorias')
  @response(200, {
    description: 'Categoria PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categoria, {partial: true}),
        },
      },
    })
    categoria: Categoria,
    @param.where(Categoria) where?: Where<Categoria>,
  ): Promise<Count> {
    return this.categoriaRepository.updateAll(categoria, where);
  }

  @get('/categorias/{id}')
  @response(200, {
    description: 'Categoria model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Categoria, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Categoria, {exclude: 'where'}) filter?: FilterExcludingWhere<Categoria>
  ): Promise<Categoria> {
    return this.categoriaRepository.findById(id, filter);
  }

  @patch('/categorias/{id}')
  @response(204, {
    description: 'Categoria PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categoria, {partial: true}),
        },
      },
    })
    categoria: Categoria,
  ): Promise<void> {
    await this.categoriaRepository.updateById(id, categoria);
  }

  @put('/categorias/{id}')
  @response(204, {
    description: 'Categoria PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() categoria: Categoria,
  ): Promise<void> {
    await this.categoriaRepository.replaceById(id, categoria);
  }

  @del('/categorias/{id}')
  @response(204, {
    description: 'Categoria DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.categoriaRepository.deleteById(id);
  }
}
