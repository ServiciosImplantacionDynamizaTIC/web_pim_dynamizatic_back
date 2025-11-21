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
import { Seccion } from '../models';
import { SeccionRepository } from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class SeccionController {
  constructor(
    @repository(SeccionRepository)
    public seccionRepository: SeccionRepository,
  ) { }

  @post('/secciones')
  @response(200, {
    description: 'Seccion model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Seccion) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seccion, {
            title: 'NewSeccion',
            exclude: ['id'],
          }),
        },
      },
    })
    seccion: Omit<Seccion, 'id'>,
  ): Promise<Seccion> {
    return this.seccionRepository.create(seccion);
  }

  @get('/secciones/count')
  @response(200, {
    description: 'Seccion model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Seccion) where?: Where<Seccion>,
  ): Promise<Count> {
    return SqlFilterUtil.ejecutarQueryCount(
      this.seccionRepository.dataSource,
      'seccion',
      where
    );
  }

  @get('/secciones')
  @response(200, {
    description: 'Array of Seccion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Seccion, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Seccion) filter?: Filter<Seccion>,
  ): Promise<Seccion[]> {
    return SqlFilterUtil.ejecutarQuerySelect(
      this.seccionRepository.dataSource,
      'seccion',
      filter,
      'id, nombre'
    );
  }


  @patch('/secciones')
  @response(200, {
    description: 'Seccion PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seccion, { partial: true }),
        },
      },
    })
    seccion: Seccion,
    @param.where(Seccion) where?: Where<Seccion>,
  ): Promise<Count> {
    return this.seccionRepository.updateAll(seccion, where);
  }

  @get('/secciones/{id}')
  @response(200, {
    description: 'Seccion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Seccion, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Seccion, { exclude: 'where' }) filter?: FilterExcludingWhere<Seccion>
  ): Promise<Seccion> {
    return this.seccionRepository.findById(id, filter);
  }

  @patch('/secciones/{id}')
  @response(204, {
    description: 'Seccion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seccion, { partial: true }),
        },
      },
    })
    seccion: Seccion,
  ): Promise<void> {
    await this.seccionRepository.updateById(id, seccion);
  }

  @put('/secciones/{id}')
  @response(204, {
    description: 'Seccion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() seccion: Seccion,
  ): Promise<void> {
    await this.seccionRepository.replaceById(id, seccion);
  }

  @del('/secciones/{id}')
  @response(204, {
    description: 'Seccion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    try {
      //Borra la seccion
      await this.seccionRepository.deleteById(id);
    } catch (e) {
      if (e.errno === 1451) {
        throw new HttpErrors.BadRequest('No se pudo eliminar el registro porque tiene otros registros relacionados.');
      } else {
        throw new HttpErrors.BadRequest('No se pudo eliminar el registro.');
      }
    }
  }
}
