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
import { SqlFilterUtil } from '../utils/sql-filter.util';

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
    return SqlFilterUtil.ejecutarQueryCount(
      this.auditoriaRepository.dataSource,
      'auditoria',
      where
    );
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
    //
    // Recuperamos los registros y llamamos a la función procesaRegistrosConImagenMiniatura que nos incluye las imagenMiniatura en la consulta
    //
    return SqlFilterUtil.ejecutarQuerySelect(
      this.auditoriaRepository.dataSource,
      'auditoria',
      filter,
      '*'
    );
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
