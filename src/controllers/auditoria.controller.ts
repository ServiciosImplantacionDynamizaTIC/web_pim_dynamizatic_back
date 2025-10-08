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
import {Auditoria} from '../models/auditoria.model';
import {AuditoriaRepository} from '../repositories';

export class AuditoriaController {
  constructor(
    @repository(AuditoriaRepository)
    public auditoriaRepository : AuditoriaRepository,
  ) {}

  @post('/auditorias')
  @response(200, {
    description: 'Auditoria model instance',
    content: {'application/json': {schema: getModelSchemaRef(Auditoria)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Auditoria, {
            title: 'NewAuditoria',
            exclude: ['id'],
          }),
        },
      },
    })
    auditoria: Omit<Auditoria, 'id'>,
  ): Promise<Auditoria> {
    return this.auditoriaRepository.create(auditoria);
  }

  @get('/auditorias/count')
  @response(200, {
    description: 'Auditoria model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Auditoria) where?: Where<Auditoria>,
  ): Promise<Count> {
    const dataSource = this.auditoriaRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM auditoria${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @get('/auditorias')
  @response(200, {
    description: 'Array of Auditoria model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Auditoria, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Auditoria) filter?: Filter<Auditoria>,
  ): Promise<Auditoria[]> {
    return this.auditoriaRepository.find(filter);
  }

  @patch('/auditorias')
  @response(200, {
    description: 'Auditoria PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Auditoria, {partial: true}),
        },
      },
    })
    auditoria: Auditoria,
    @param.where(Auditoria) where?: Where<Auditoria>,
  ): Promise<Count> {
    return this.auditoriaRepository.updateAll(auditoria, where);
  }

  @get('/auditorias/{id}')
  @response(200, {
    description: 'Auditoria model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Auditoria, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Auditoria, {exclude: 'where'}) filter?: FilterExcludingWhere<Auditoria>
  ): Promise<Auditoria> {
    return this.auditoriaRepository.findById(id, filter);
  }

  @patch('/auditorias/{id}')
  @response(204, {
    description: 'Auditoria PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Auditoria, {partial: true}),
        },
      },
    })
    auditoria: Auditoria,
  ): Promise<void> {
    await this.auditoriaRepository.updateById(id, auditoria);
  }

  @put('/auditorias/{id}')
  @response(204, {
    description: 'Auditoria PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() auditoria: Auditoria,
  ): Promise<void> {
    await this.auditoriaRepository.replaceById(id, auditoria);
  }

  @del('/auditorias/{id}')
  @response(204, {
    description: 'Auditoria DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.auditoriaRepository.deleteById(id);
  }
}
