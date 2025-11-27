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
import { SqlFilterUtil } from '../utils/sql-filter.util';

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
    return SqlFilterUtil.ejecutarQueryCount(
      this.campoDinamicoRepository.dataSource,
      'campo_dinamico',
      where
    );
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
    //
    // Recuperamos los registros y llamamos a la función procesaRegistrosConImagenMiniatura que nos incluye las imagenMiniatura en la consulta
    //
    return SqlFilterUtil.ejecutarQuerySelect(
      this.campoDinamicoRepository.dataSource,
      'campo_dinamico',
      filter,
      '*'
    );
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
