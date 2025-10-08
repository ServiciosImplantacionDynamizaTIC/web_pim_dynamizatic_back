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
import {Icono} from '../models/icono.model';
import {IconoRepository} from '../repositories';

export class IconoController {
  constructor(
    @repository(IconoRepository)
    public iconoRepository : IconoRepository,
  ) {}

  @post('/iconos')
  @response(200, {
    description: 'Icono model instance',
    content: {'application/json': {schema: getModelSchemaRef(Icono)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Icono, {
            title: 'NewIcono',
            exclude: ['id'],
          }),
        },
      },
    })
    icono: Omit<Icono, 'id'>,
  ): Promise<Icono> {
    return this.iconoRepository.create(icono);
  }

  @get('/iconos/count')
  @response(200, {
    description: 'Icono model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Icono) where?: Where<Icono>,
  ): Promise<Count> {
    const dataSource = this.iconoRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM icono${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @get('/iconos')
  @response(200, {
    description: 'Array of Icono model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Icono, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Icono) filter?: Filter<Icono>,
  ): Promise<Icono[]> {
    return this.iconoRepository.find(filter);
  }

  @patch('/iconos')
  @response(200, {
    description: 'Icono PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Icono, {partial: true}),
        },
      },
    })
    icono: Icono,
    @param.where(Icono) where?: Where<Icono>,
  ): Promise<Count> {
    return this.iconoRepository.updateAll(icono, where);
  }

  @get('/iconos/{id}')
  @response(200, {
    description: 'Icono model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Icono, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Icono, {exclude: 'where'}) filter?: FilterExcludingWhere<Icono>
  ): Promise<Icono> {
    return this.iconoRepository.findById(id, filter);
  }

  @patch('/iconos/{id}')
  @response(204, {
    description: 'Icono PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Icono, {partial: true}),
        },
      },
    })
    icono: Icono,
  ): Promise<void> {
    await this.iconoRepository.updateById(id, icono);
  }

  @put('/iconos/{id}')
  @response(204, {
    description: 'Icono PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() icono: Icono,
  ): Promise<void> {
    await this.iconoRepository.replaceById(id, icono);
  }

  @del('/iconos/{id}')
  @response(204, {
    description: 'Icono DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.iconoRepository.deleteById(id);
  }
}

