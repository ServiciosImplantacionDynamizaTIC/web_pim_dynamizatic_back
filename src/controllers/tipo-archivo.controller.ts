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
import { TipoArchivo } from '../models';
import { TipoArchivoRepository } from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class TipoArchivoController {
  constructor(
    @repository(TipoArchivoRepository)
    public tipoArchivoRepository: TipoArchivoRepository,
  ) { }

  @post('/tipo-archivos')
  @response(200, {
    description: 'TipoArchivo model instance',
    content: { 'application/json': { schema: getModelSchemaRef(TipoArchivo) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoArchivo, {
            title: 'NewTipoArchivo',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoArchivo: Omit<TipoArchivo, 'id'>,
  ): Promise<TipoArchivo> {
    return this.tipoArchivoRepository.create(tipoArchivo);
  }

  @get('/tipo-archivos/count')
  @response(200, {
    description: 'TipoArchivo model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(TipoArchivo) where?: Where<TipoArchivo>,
  ): Promise<Count> {
    return this.tipoArchivoRepository.count(where);
  }

  @get('/tipo-archivos')
  @response(200, {
    description: 'Array of TipoArchivo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoArchivo, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(TipoArchivo) filter?: Filter<TipoArchivo>,
  ): Promise<TipoArchivo[]> {
    return this.tipoArchivoRepository.find(filter);
  }

  @patch('/tipo-archivos')
  @response(200, {
    description: 'TipoArchivo PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoArchivo, { partial: true }),
        },
      },
    })
    tipoArchivo: TipoArchivo,
    @param.where(TipoArchivo) where?: Where<TipoArchivo>,
  ): Promise<Count> {
    return this.tipoArchivoRepository.updateAll(tipoArchivo, where);
  }

  @get('/tipo-archivos/{id}')
  @response(200, {
    description: 'TipoArchivo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoArchivo, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoArchivo, { exclude: 'where' }) filter?: FilterExcludingWhere<TipoArchivo>
  ): Promise<TipoArchivo> {
    return this.tipoArchivoRepository.findById(id, filter);
  }

  @patch('/tipo-archivos/{id}')
  @response(204, {
    description: 'TipoArchivo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoArchivo, { partial: true }),
        },
      },
    })
    tipoArchivo: TipoArchivo,
  ): Promise<void> {
    await this.tipoArchivoRepository.updateById(id, tipoArchivo);
  }

  @put('/tipo-archivos/{id}')
  @response(204, {
    description: 'TipoArchivo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tipoArchivo: TipoArchivo,
  ): Promise<void> {
    await this.tipoArchivoRepository.replaceById(id, tipoArchivo);
  }

  @del('/tipo-archivos/{id}')
  @response(204, {
    description: 'TipoArchivo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    try {
      //Borra el tipo de archivo
      await this.tipoArchivoRepository.deleteById(id);
    } catch (e) {
      if (e.errno === 1451) {
        throw new HttpErrors.BadRequest('No se pudo eliminar el registro porque tiene otros registros relacionados.');
      } else {
        throw new HttpErrors.BadRequest('No se pudo eliminar el registro.');
      }
    }
  }

  @get('/vistaTipoArchivoEmpresaSeccion')
  @response(200, {
    description: 'Devuelve tipos de archivo y su seccion',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async vistaTipoArchivoEmpresaSeccion(@param.filter(TipoArchivo) filter?: Filter<Object>,): Promise<Object[]> {
    return SqlFilterUtil.ejecutarQuerySelect(
      this.tipoArchivoRepository.dataSource,
      'vista_tipo_archivo_empresa_seccion',
      filter
    );
  };

  @get('/vistaTipoArchivoEmpresaSeccionCount')
  @response(200, {
    description: 'Devuelve plantillas email y su idioma',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async vistaTipoArchivoEmpresaSeccionCount(@param.where(TipoArchivo) where?: Where<TipoArchivo>,): Promise<TipoArchivo[]> {
    return SqlFilterUtil.ejecutarQueryCount(
      this.tipoArchivoRepository.dataSource,
      'vista_tipo_archivo_empresa_seccion',
      where
    );
  }
}

