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
import {TipoUsuario} from '../models';
import {TipoUsuarioRepository} from '../repositories';

export class TipoUsuarioController {
  constructor(
    @repository(TipoUsuarioRepository)
    public tipoUsuarioRepository : TipoUsuarioRepository,
  ) {}

  @post('/tipo-usuarios')
  @response(200, {
    description: 'TipoUsuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoUsuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoUsuario, {
            title: 'NewTipoUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoUsuario: Omit<TipoUsuario, 'id'>,
  ): Promise<TipoUsuario> {
    return this.tipoUsuarioRepository.create(tipoUsuario);
  }

  @get('/tipo-usuarios/count')
  @response(200, {
    description: 'TipoUsuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoUsuario) where?: Where<TipoUsuario>,
  ): Promise<Count> {
    return this.tipoUsuarioRepository.count(where);
  }

  @get('/tipo-usuarios')
  @response(200, {
    description: 'Array of TipoUsuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoUsuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoUsuario) filter?: Filter<TipoUsuario>,
  ): Promise<TipoUsuario[]> {
    return this.tipoUsuarioRepository.find(filter);
  }

  @patch('/tipo-usuarios')
  @response(200, {
    description: 'TipoUsuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoUsuario, {partial: true}),
        },
      },
    })
    tipoUsuario: TipoUsuario,
    @param.where(TipoUsuario) where?: Where<TipoUsuario>,
  ): Promise<Count> {
    return this.tipoUsuarioRepository.updateAll(tipoUsuario, where);
  }

  @get('/tipo-usuarios/{id}')
  @response(200, {
    description: 'TipoUsuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoUsuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoUsuario, {exclude: 'where'}) filter?: FilterExcludingWhere<TipoUsuario>
  ): Promise<TipoUsuario> {
    return this.tipoUsuarioRepository.findById(id, filter);
  }

  @patch('/tipo-usuarios/{id}')
  @response(204, {
    description: 'TipoUsuario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoUsuario, {partial: true}),
        },
      },
    })
    tipoUsuario: TipoUsuario,
  ): Promise<void> {
    await this.tipoUsuarioRepository.updateById(id, tipoUsuario);
  }

  @put('/tipo-usuarios/{id}')
  @response(204, {
    description: 'TipoUsuario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tipoUsuario: TipoUsuario,
  ): Promise<void> {
    await this.tipoUsuarioRepository.replaceById(id, tipoUsuario);
  }

  @del('/tipo-usuarios/{id}')
  @response(204, {
    description: 'TipoUsuario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoUsuarioRepository.deleteById(id);
  }
}

