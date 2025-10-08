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
import {Catalogo} from '../models/catalogo.model';
import {CatalogoRepository} from '../repositories';

export class CatalogoController {
  constructor(
    @repository(CatalogoRepository)
    public catalogoRepository : CatalogoRepository,
  ) {}

  @post('/catalogos')
  @response(200, {
    description: 'Catalogo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Catalogo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Catalogo, {
            title: 'NewCatalogo',
            exclude: ['id'],
          }),
        },
      },
    })
    catalogo: Omit<Catalogo, 'id'>,
  ): Promise<Catalogo> {
    return this.catalogoRepository.create(catalogo);
  }

  @get('/catalogos/count')
  @response(200, {
    description: 'Catalogo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Catalogo) where?: Where<Catalogo>,
  ): Promise<Count> {
    const dataSource = this.catalogoRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM catalogo${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @get('/catalogos')
  @response(200, {
    description: 'Array of Catalogo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Catalogo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Catalogo) filter?: Filter<Catalogo>,
  ): Promise<Catalogo[]> {
    return this.catalogoRepository.find(filter);
  }

  @patch('/catalogos')
  @response(200, {
    description: 'Catalogo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Catalogo, {partial: true}),
        },
      },
    })
    catalogo: Catalogo,
    @param.where(Catalogo) where?: Where<Catalogo>,
  ): Promise<Count> {
    return this.catalogoRepository.updateAll(catalogo, where);
  }

  @get('/catalogos/{id}')
  @response(200, {
    description: 'Catalogo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Catalogo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Catalogo, {exclude: 'where'}) filter?: FilterExcludingWhere<Catalogo>
  ): Promise<Catalogo> {
    return this.catalogoRepository.findById(id, filter);
  }

  @patch('/catalogos/{id}')
  @response(204, {
    description: 'Catalogo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Catalogo, {partial: true}),
        },
      },
    })
    catalogo: Catalogo,
  ): Promise<void> {
    await this.catalogoRepository.updateById(id, catalogo);
  }

  @put('/catalogos/{id}')
  @response(204, {
    description: 'Catalogo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() catalogo: Catalogo,
  ): Promise<void> {
    await this.catalogoRepository.replaceById(id, catalogo);
  }

  @del('/catalogos/{id}')
  @response(204, {
    description: 'Catalogo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.catalogoRepository.deleteById(id);
  }
}
