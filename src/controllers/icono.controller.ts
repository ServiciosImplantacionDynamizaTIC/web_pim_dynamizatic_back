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
import { SqlFilterUtil } from '../utils/sql-filter.util';

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
    return await SqlFilterUtil.ejecutarQueryCount(dataSource, 'icono', where);    
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
    const dataSource = this.iconoRepository.dataSource;
    const camposSelect = "*"
    return await SqlFilterUtil.ejecutarQuerySelect(dataSource, 'icono', filter, camposSelect);

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

