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
import {ConfiguracionDiseno} from '../models/configuracion-diseno.model';
import {ConfiguracionDisenoRepository} from '../repositories';

export class ConfiguracionDisenoController {
  constructor(
    @repository(ConfiguracionDisenoRepository)
    public configuracionDisenoRepository : ConfiguracionDisenoRepository,
  ) {}

  @post('/configuracion-disenos')
  @response(200, {
    description: 'ConfiguracionDiseno model instance',
    content: {'application/json': {schema: getModelSchemaRef(ConfiguracionDiseno)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ConfiguracionDiseno, {
            title: 'NewConfiguracionDiseno',
            exclude: ['id'],
          }),
        },
      },
    })
    configuracionDiseno: Omit<ConfiguracionDiseno, 'id'>,
  ): Promise<ConfiguracionDiseno> {
    return this.configuracionDisenoRepository.create(configuracionDiseno);
  }

  @get('/configuracion-disenos/count')
  @response(200, {
    description: 'ConfiguracionDiseno model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ConfiguracionDiseno) where?: Where<ConfiguracionDiseno>,
  ): Promise<Count> {
    const dataSource = this.configuracionDisenoRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM configuracion_diseno${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @get('/configuracion-disenos')
  @response(200, {
    description: 'Array of ConfiguracionDiseno model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ConfiguracionDiseno, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ConfiguracionDiseno) filter?: Filter<ConfiguracionDiseno>,
  ): Promise<ConfiguracionDiseno[]> {
    return this.configuracionDisenoRepository.find(filter);
  }

  @patch('/configuracion-disenos')
  @response(200, {
    description: 'ConfiguracionDiseno PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ConfiguracionDiseno, {partial: true}),
        },
      },
    })
    configuracionDiseno: ConfiguracionDiseno,
    @param.where(ConfiguracionDiseno) where?: Where<ConfiguracionDiseno>,
  ): Promise<Count> {
    return this.configuracionDisenoRepository.updateAll(configuracionDiseno, where);
  }

  @get('/configuracion-disenos/{id}')
  @response(200, {
    description: 'ConfiguracionDiseno model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ConfiguracionDiseno, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ConfiguracionDiseno, {exclude: 'where'}) filter?: FilterExcludingWhere<ConfiguracionDiseno>
  ): Promise<ConfiguracionDiseno> {
    return this.configuracionDisenoRepository.findById(id, filter);
  }

  @patch('/configuracion-disenos/{id}')
  @response(204, {
    description: 'ConfiguracionDiseno PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ConfiguracionDiseno, {partial: true}),
        },
      },
    })
    configuracionDiseno: ConfiguracionDiseno,
  ): Promise<void> {
    await this.configuracionDisenoRepository.updateById(id, configuracionDiseno);
  }

  @put('/configuracion-disenos/{id}')
  @response(204, {
    description: 'ConfiguracionDiseno PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() configuracionDiseno: ConfiguracionDiseno,
  ): Promise<void> {
    await this.configuracionDisenoRepository.replaceById(id, configuracionDiseno);
  }

  @del('/configuracion-disenos/{id}')
  @response(204, {
    description: 'ConfiguracionDiseno DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.configuracionDisenoRepository.deleteById(id);
  }
}

