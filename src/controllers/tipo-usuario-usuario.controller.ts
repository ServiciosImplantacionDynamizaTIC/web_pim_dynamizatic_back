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
import {TipoUsuarioUsuario} from '../models';
import {TipoUsuarioUsuarioRepository} from '../repositories';

export class TipoUsuarioUsuarioController {
  constructor(
    @repository(TipoUsuarioUsuarioRepository)
    public tipoUsuarioUsuarioRepository : TipoUsuarioUsuarioRepository,
  ) {}

  @post('/tipo-usuario-usuarios')
  @response(200, {
    description: 'TipoUsuarioUsuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoUsuarioUsuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoUsuarioUsuario, {
            title: 'NewTipoUsuarioUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoUsuarioUsuario: Omit<TipoUsuarioUsuario, 'id'>,
  ): Promise<TipoUsuarioUsuario> {
    return this.tipoUsuarioUsuarioRepository.create(tipoUsuarioUsuario);
  }

  @get('/tipo-usuario-usuarios/count')
  @response(200, {
    description: 'TipoUsuarioUsuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoUsuarioUsuario) where?: Where<TipoUsuarioUsuario>,
  ): Promise<Count> {
    return this.tipoUsuarioUsuarioRepository.count(where);
  }

  @get('/tipo-usuario-usuarios')
  @response(200, {
    description: 'Array of TipoUsuarioUsuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoUsuarioUsuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoUsuarioUsuario) filter?: Filter<TipoUsuarioUsuario>,
  ): Promise<TipoUsuarioUsuario[]> {
    return this.tipoUsuarioUsuarioRepository.find(filter);
  }

  @patch('/tipo-usuario-usuarios')
  @response(200, {
    description: 'TipoUsuarioUsuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoUsuarioUsuario, {partial: true}),
        },
      },
    })
    tipoUsuarioUsuario: TipoUsuarioUsuario,
    @param.where(TipoUsuarioUsuario) where?: Where<TipoUsuarioUsuario>,
  ): Promise<Count> {
    return this.tipoUsuarioUsuarioRepository.updateAll(tipoUsuarioUsuario, where);
  }

  @get('/tipo-usuario-usuarios/{id}')
  @response(200, {
    description: 'TipoUsuarioUsuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoUsuarioUsuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoUsuarioUsuario, {exclude: 'where'}) filter?: FilterExcludingWhere<TipoUsuarioUsuario>
  ): Promise<TipoUsuarioUsuario> {
    return this.tipoUsuarioUsuarioRepository.findById(id, filter);
  }

  @patch('/tipo-usuario-usuarios/{id}')
  @response(204, {
    description: 'TipoUsuarioUsuario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoUsuarioUsuario, {partial: true}),
        },
      },
    })
    tipoUsuarioUsuario: TipoUsuarioUsuario,
  ): Promise<void> {
    await this.tipoUsuarioUsuarioRepository.updateById(id, tipoUsuarioUsuario);
  }

  @put('/tipo-usuario-usuarios/{id}')
  @response(204, {
    description: 'TipoUsuarioUsuario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tipoUsuarioUsuario: TipoUsuarioUsuario,
  ): Promise<void> {
    await this.tipoUsuarioUsuarioRepository.replaceById(id, tipoUsuarioUsuario);
  }

  @del('/tipo-usuario-usuarios/{id}')
  @response(204, {
    description: 'TipoUsuarioUsuario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoUsuarioUsuarioRepository.deleteById(id);
  }
}

