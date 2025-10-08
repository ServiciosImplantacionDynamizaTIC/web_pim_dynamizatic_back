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
import {CampoDinamico} from '../models/campo-dinamico.model';
import {CampoDinamicoRepository} from '../repositories';

export class CampoDinamicoController {
  constructor(
    @repository(CampoDinamicoRepository)
    public campoDinamicoRepository : CampoDinamicoRepository,
  ) {}

  @post('/campo-dinamicos')
  @response(200, {
    description: 'CampoDinamico model instance',
    content: {'application/json': {schema: getModelSchemaRef(CampoDinamico)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CampoDinamico, {
            title: 'NewCampoDinamico',
            exclude: ['id'],
          }),
        },
      },
    })
    campoDinamico: Omit<CampoDinamico, 'id'>,
  ): Promise<CampoDinamico> {
    return this.campoDinamicoRepository.create(campoDinamico);
  }

  @get('/campo-dinamicos/count')
  @response(200, {
    description: 'CampoDinamico model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CampoDinamico) where?: Where<CampoDinamico>,
  ): Promise<Count> {
    const dataSource = this.campoDinamicoRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM campo_dinamico${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @get('/campo-dinamicos')
  @response(200, {
    description: 'Array of CampoDinamico model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CampoDinamico, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CampoDinamico) filter?: Filter<CampoDinamico>,
  ): Promise<CampoDinamico[]> {
    return this.campoDinamicoRepository.find(filter);
  }

  @patch('/campo-dinamicos')
  @response(200, {
    description: 'CampoDinamico PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CampoDinamico, {partial: true}),
        },
      },
    })
    campoDinamico: CampoDinamico,
    @param.where(CampoDinamico) where?: Where<CampoDinamico>,
  ): Promise<Count> {
    return this.campoDinamicoRepository.updateAll(campoDinamico, where);
  }

  @get('/campo-dinamicos/{id}')
  @response(200, {
    description: 'CampoDinamico model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CampoDinamico, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CampoDinamico, {exclude: 'where'}) filter?: FilterExcludingWhere<CampoDinamico>
  ): Promise<CampoDinamico> {
    return this.campoDinamicoRepository.findById(id, filter);
  }

  @patch('/campo-dinamicos/{id}')
  @response(204, {
    description: 'CampoDinamico PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CampoDinamico, {partial: true}),
        },
      },
    })
    campoDinamico: CampoDinamico,
  ): Promise<void> {
    await this.campoDinamicoRepository.updateById(id, campoDinamico);
  }

  @put('/campo-dinamicos/{id}')
  @response(204, {
    description: 'CampoDinamico PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() campoDinamico: CampoDinamico,
  ): Promise<void> {
    await this.campoDinamicoRepository.replaceById(id, campoDinamico);
  }

  @del('/campo-dinamicos/{id}')
  @response(204, {
    description: 'CampoDinamico DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.campoDinamicoRepository.deleteById(id);
  }
}
