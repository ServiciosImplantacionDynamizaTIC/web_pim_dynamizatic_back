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
import {CatalogoProducto} from '../models/catalogo-producto.model';
import {CatalogoProductoRepository} from '../repositories';

export class CatalogoProductoController {
  constructor(
    @repository(CatalogoProductoRepository)
    public catalogoProductoRepository : CatalogoProductoRepository,
  ) {}

  @post('/catalogo-productos')
  @response(200, {
    description: 'CatalogoProducto model instance',
    content: {'application/json': {schema: getModelSchemaRef(CatalogoProducto)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CatalogoProducto, {
            title: 'NewCatalogoProducto',
            exclude: ['id'],
          }),
        },
      },
    })
    catalogoProducto: Omit<CatalogoProducto, 'id'>,
  ): Promise<CatalogoProducto> {
    return this.catalogoProductoRepository.create(catalogoProducto);
  }

  @get('/catalogo-productos/count')
  @response(200, {
    description: 'CatalogoProducto model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CatalogoProducto) where?: Where<CatalogoProducto>,
  ): Promise<Count> {
    const dataSource = this.catalogoProductoRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM catalogo_producto${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @get('/catalogo-productos')
  @response(200, {
    description: 'Array of CatalogoProducto model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CatalogoProducto, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CatalogoProducto) filter?: Filter<CatalogoProducto>,
  ): Promise<CatalogoProducto[]> {
    return this.catalogoProductoRepository.find(filter);
  }

  @patch('/catalogo-productos')
  @response(200, {
    description: 'CatalogoProducto PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CatalogoProducto, {partial: true}),
        },
      },
    })
    catalogoProducto: CatalogoProducto,
    @param.where(CatalogoProducto) where?: Where<CatalogoProducto>,
  ): Promise<Count> {
    return this.catalogoProductoRepository.updateAll(catalogoProducto, where);
  }

  @get('/catalogo-productos/{id}')
  @response(200, {
    description: 'CatalogoProducto model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CatalogoProducto, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CatalogoProducto, {exclude: 'where'}) filter?: FilterExcludingWhere<CatalogoProducto>
  ): Promise<CatalogoProducto> {
    return this.catalogoProductoRepository.findById(id, filter);
  }

  @patch('/catalogo-productos/{id}')
  @response(204, {
    description: 'CatalogoProducto PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CatalogoProducto, {partial: true}),
        },
      },
    })
    catalogoProducto: CatalogoProducto,
  ): Promise<void> {
    await this.catalogoProductoRepository.updateById(id, catalogoProducto);
  }

  @put('/catalogo-productos/{id}')
  @response(204, {
    description: 'CatalogoProducto PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() catalogoProducto: CatalogoProducto,
  ): Promise<void> {
    await this.catalogoProductoRepository.replaceById(id, catalogoProducto);
  }

  @del('/catalogo-productos/{id}')
  @response(204, {
    description: 'CatalogoProducto DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.catalogoProductoRepository.deleteById(id);
  }
}
