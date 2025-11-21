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
import { Rol } from '../models';
import { RolRepository } from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class RolController {
  constructor(
    @repository(RolRepository)
    public rolRepository: RolRepository,
  ) { }

  @post('/roles')
  @response(200, {
    description: 'Rol model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Rol) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {
            title: 'NewRol',
            exclude: ['id'],
          }),
        },
      },
    })
    rol: Omit<Rol, 'id'>,
  ): Promise<Rol> {
    return this.rolRepository.create(rol);
  }

  @get('/roles/count')
  @response(200, {
    description: 'Rol model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Rol) where?: Where<Rol>,
  ): Promise<Count> {
    return SqlFilterUtil.ejecutarQueryCount(
      this.rolRepository.dataSource,
      'rol',
      where
    );
  }

  @get('/roles')
  @response(200, {
    description: 'Array of Rol model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Rol, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Rol) filter?: Filter<Rol>,
  ): Promise<Rol[]> {
    return SqlFilterUtil.ejecutarQuerySelect(
      this.rolRepository.dataSource,
      'rol',
      filter
    );
  }

  @patch('/roles')
  @response(200, {
    description: 'Rol PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, { partial: true }),
        },
      },
    })
    rol: Rol,
    @param.where(Rol) where?: Where<Rol>,
  ): Promise<Count> {
    return this.rolRepository.updateAll(rol, where);
  }

  @get('/roles/{id}')
  @response(200, {
    description: 'Rol model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Rol, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Rol, { exclude: 'where' }) filter?: FilterExcludingWhere<Rol>
  ): Promise<Rol> {
    return this.rolRepository.findById(id, filter);
  }

  @patch('/roles/{id}')
  @response(204, {
    description: 'Rol PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, { partial: true }),
        },
      },
    })
    rol: Rol,
  ): Promise<void> {
    await this.rolRepository.updateById(id, rol);
  }

  @put('/roles/{id}')
  @response(204, {
    description: 'Rol PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() rol: Rol,
  ): Promise<void> {
    await this.rolRepository.replaceById(id, rol);
  }

  @del('/roles/{id}')
  @response(204, {
    description: 'Rol DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.rolRepository.deleteById(id);
  }

  @get('/vistaEmpresaRol')
  @response(200, {
    description: 'Devuelve empresas, roles',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async vistaEmpresaRol(@param.filter(Rol) filter?: Filter<Object>,): Promise<Object[]> {
    return SqlFilterUtil.ejecutarQuerySelect( this.rolRepository.dataSource, 'vista_empresa_rol', filter );
  }

  @get('/vistaEmpresaRolCount')
  @response(200, {
    description: 'Devuelve los roles y su nombre de empresa',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async vistaEmpresaRolCount(@param.where(Rol) where?: Where<Rol>,): Promise<Rol[]> {
    return SqlFilterUtil.ejecutarQueryCount( this.rolRepository.dataSource, 'vista_empresa_rol', where );
  }

  @get('/buscarIdRol')
  @response(200, {
    description: 'Array of Rol model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Rol, { includeRelations: true }),
        },
      },
    },
  })
  async buscarIdRol(
    @param.query.string('nombre') nombre: string,
  ): Promise<Rol[]> {
    const filter: Filter<Rol> = {
      where: {
        nombre: nombre,
      },
    };
    try {
      return await this.rolRepository.find(filter);
    } catch (error) {
      console.error('Error finding roles:', error);
      throw new Error('Error finding roles');
    }
  }
}
