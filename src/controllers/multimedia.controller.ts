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
import {Multimedia} from '../models/multimedia.model';
import {MultimediaRepository} from '../repositories';

export class MultimediaController {
  constructor(
    @repository(MultimediaRepository)
    public multimediaRepository : MultimediaRepository,
  ) {}

  @post('/multimedias')
  @response(200, {
    description: 'Multimedia model instance',
    content: {'application/json': {schema: getModelSchemaRef(Multimedia)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Multimedia, {
            title: 'NewMultimedia',
            exclude: ['id'],
          }),
        },
      },
    })
    multimedia: Omit<Multimedia, 'id'>,
  ): Promise<Multimedia> {
    return this.multimediaRepository.create(multimedia);
  }

  @get('/multimedias/count')
  @response(200, {
    description: 'Multimedia model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Multimedia) where?: Where<Multimedia>,
  ): Promise<Count> {
    const dataSource = this.multimediaRepository.dataSource;
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
    const query = `SELECT COUNT(*) AS count FROM multimedia${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @get('/multimedias')
  @response(200, {
    description: 'Array of Multimedia model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Multimedia, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Multimedia) filter?: Filter<Multimedia>,
  ): Promise<Multimedia[]> {
    const dataSource = this.multimediaRepository.dataSource;
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
    const query = `SELECT * FROM multimedia${filtros}`;
    const registros = await dataSource.execute(query);
    return registros;
  }

  @patch('/multimedias')
  @response(200, {
    description: 'Multimedia PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Multimedia, {partial: true}),
        },
      },
    })
    multimedia: Multimedia,
    @param.where(Multimedia) where?: Where<Multimedia>,
  ): Promise<Count> {
    return this.multimediaRepository.updateAll(multimedia, where);
  }

  @get('/multimedias/{id}')
  @response(200, {
    description: 'Multimedia model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Multimedia, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Multimedia, {exclude: 'where'}) filter?: FilterExcludingWhere<Multimedia>
  ): Promise<Multimedia> {
    return this.multimediaRepository.findById(id, filter);
  }

  @patch('/multimedias/{id}')
  @response(204, {
    description: 'Multimedia PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Multimedia, {partial: true}),
        },
      },
    })
    multimedia: Multimedia,
  ): Promise<void> {
    await this.multimediaRepository.updateById(id, multimedia);
  }

  @put('/multimedias/{id}')
  @response(204, {
    description: 'Multimedia PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() multimedia: Multimedia,
  ): Promise<void> {
    await this.multimediaRepository.replaceById(id, multimedia);
  }

  @del('/multimedias/{id}')
  @response(204, {
    description: 'Multimedia DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.multimediaRepository.deleteById(id);
  }
}

