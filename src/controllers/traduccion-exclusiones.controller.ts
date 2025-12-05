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
  HttpErrors,
} from '@loopback/rest';
import { TraduccionExclusiones } from '../models';
import { TraduccionExclusionesRepository } from '../repositories';

export class TraduccionExclusionesController {
  constructor(
    @repository(TraduccionExclusionesRepository)
    public traduccionExclusionesRepository: TraduccionExclusionesRepository,
  ) { }

  @post('/traduccion-exclusiones')
  @response(200, {
    description: 'TraduccionExclusiones model instance',
    content: { 'application/json': { schema: getModelSchemaRef(TraduccionExclusiones) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionExclusiones, {
            title: 'NewTraduccionExclusiones',
            exclude: ['id'],
          }),
        },
      },
    })
    traduccionExclusiones: Omit<TraduccionExclusiones, 'id'>,
  ): Promise<TraduccionExclusiones> {
    return this.traduccionExclusionesRepository.create(traduccionExclusiones);
  }

  @get('/traduccion-exclusiones/count')
  @response(200, {
    description: 'TraduccionExclusiones model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(TraduccionExclusiones) where?: Where<TraduccionExclusiones>,
  ): Promise<Count> {
    const dataSource = this.traduccionExclusionesRepository.dataSource;
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
                  //Corrije el nombre del campo
                  if (subKey !== 'activoSn' && subKey !== 'tipoExclusion') {
                    filtros += ` ${subKey} LIKE '%${subValue}%'`;
                  }
                  else {
                    filtros += ` ${subKey} = '${subValue}'`;
                  }
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
    const query = `SELECT COUNT(*) AS count FROM traduccion_exclusiones${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros;
  }

  @get('/traduccion-exclusiones')
  @response(200, {
    description: 'Array of TraduccionExclusiones model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TraduccionExclusiones, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(TraduccionExclusiones) filter?: Filter<TraduccionExclusiones>,
  ): Promise<TraduccionExclusiones[]> {
    const dataSource = this.traduccionExclusionesRepository.dataSource;
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
                  //Corrije el nombre del campo
                  if (subKey !== 'activoSn' && subKey !== 'tipoExclusion') {
                    filtros += ` ${subKey} LIKE '%${subValue}%'`;
                  }
                  else {
                    filtros += ` ${subKey} = '${subValue}'`;
                  }
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
    const query = `SELECT id, tipoExclusion, valor, descripcion, activoSn, fechaCreacion, fechaModificacion, usuarioCreacion, usuarioModificacion FROM traduccion_exclusiones${filtros}`;
    const registros = await dataSource.execute(query);
    return registros;
  }

  @patch('/traduccion-exclusiones')
  @response(200, {
    description: 'TraduccionExclusiones PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionExclusiones, { partial: true }),
        },
      },
    })
    traduccionExclusiones: TraduccionExclusiones,
    @param.where(TraduccionExclusiones) where?: Where<TraduccionExclusiones>,
  ): Promise<Count> {
    return this.traduccionExclusionesRepository.updateAll(traduccionExclusiones, where);
  }

  @get('/traduccion-exclusiones/{id}')
  @response(200, {
    description: 'TraduccionExclusiones model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TraduccionExclusiones, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TraduccionExclusiones, { exclude: 'where' }) filter?: FilterExcludingWhere<TraduccionExclusiones>
  ): Promise<TraduccionExclusiones> {
    return this.traduccionExclusionesRepository.findById(id, filter);
  }

  @patch('/traduccion-exclusiones/{id}')
  @response(204, {
    description: 'TraduccionExclusiones PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionExclusiones, { partial: true }),
        },
      },
    })
    traduccionExclusiones: TraduccionExclusiones,
  ): Promise<void> {
    await this.traduccionExclusionesRepository.updateById(id, traduccionExclusiones);
  }

  @put('/traduccion-exclusiones/{id}')
  @response(204, {
    description: 'TraduccionExclusiones PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() traduccionExclusiones: TraduccionExclusiones,
  ): Promise<void> {
    await this.traduccionExclusionesRepository.replaceById(id, traduccionExclusiones);
  }

  @del('/traduccion-exclusiones/{id}')
  @response(204, {
    description: 'TraduccionExclusiones DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    try {
      await this.traduccionExclusionesRepository.deleteById(id);
    } catch (e) {
      if (e.errno === 1451) {
        throw new HttpErrors.BadRequest('No se pudo eliminar el registro porque tiene otros registros relacionados.');
      } else {
        throw new HttpErrors.BadRequest('No se pudo eliminar el registro.');
      }
    }
  }
}
