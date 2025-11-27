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
import {CalendariosDisponibilidad} from '../models';
import {CalendariosDisponibilidadRepository} from '../repositories';
import { SqlFilterUtil } from '../utils/sql-filter.util';

export class CalendariosDisponibilidadController {
  constructor(
    @repository(CalendariosDisponibilidadRepository)
    public calendariosDisponibilidadRepository : CalendariosDisponibilidadRepository,
  ) {}

  @post('/calendarios-disponibilidades')
  @response(200, {
    description: 'CalendariosDisponibilidad model instance',
    content: {'application/json': {schema: getModelSchemaRef(CalendariosDisponibilidad)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CalendariosDisponibilidad, {
            title: 'NewCalendariosDisponibilidad',
            exclude: ['id'],
          }),
        },
      },
    })
    calendariosDisponibilidad: Omit<CalendariosDisponibilidad, 'id'>,
  ): Promise<CalendariosDisponibilidad> {
    return this.calendariosDisponibilidadRepository.create(calendariosDisponibilidad);
  }

  @get('/calendarios-disponibilidades/count')
  @response(200, {
    description: 'CalendariosDisponibilidad model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CalendariosDisponibilidad) where?: Where<CalendariosDisponibilidad>,
  ): Promise<Count> {
    return SqlFilterUtil.ejecutarQueryCount(
      this.calendariosDisponibilidadRepository.dataSource,
      'calendarios_disponibilidad',
      where
    );
  }

  @get('/calendarios-disponibilidades')
  @response(200, {
    description: 'Array of CalendariosDisponibilidad model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CalendariosDisponibilidad, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CalendariosDisponibilidad) filter?: Filter<CalendariosDisponibilidad>,
  ): Promise<CalendariosDisponibilidad[]> {
    //
    // Recuperamos los registros y llamamos a la función procesaRegistrosConImagenMiniatura que nos incluye las imagenMiniatura en la consulta
    //
    return SqlFilterUtil.ejecutarQuerySelect(
      this.calendariosDisponibilidadRepository.dataSource,
      'calendarios_disponibilidad',
      filter,
      '*'
    );
  }

  @patch('/calendarios-disponibilidades')
  @response(200, {
    description: 'CalendariosDisponibilidad PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CalendariosDisponibilidad, {partial: true}),
        },
      },
    })
    calendariosDisponibilidad: CalendariosDisponibilidad,
    @param.where(CalendariosDisponibilidad) where?: Where<CalendariosDisponibilidad>,
  ): Promise<Count> {
    return this.calendariosDisponibilidadRepository.updateAll(calendariosDisponibilidad, where);
  }

  @get('/calendarios-disponibilidades/{id}')
  @response(200, {
    description: 'CalendariosDisponibilidad model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CalendariosDisponibilidad, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CalendariosDisponibilidad, {exclude: 'where'}) filter?: FilterExcludingWhere<CalendariosDisponibilidad>
  ): Promise<CalendariosDisponibilidad> {
    return this.calendariosDisponibilidadRepository.findById(id, filter);
  }

  @patch('/calendarios-disponibilidades/{id}')
  @response(204, {
    description: 'CalendariosDisponibilidad PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CalendariosDisponibilidad, {partial: true}),
        },
      },
    })
    calendariosDisponibilidad: CalendariosDisponibilidad,
  ): Promise<void> {
    await this.calendariosDisponibilidadRepository.updateById(id, calendariosDisponibilidad);
  }

  @put('/calendarios-disponibilidades/{id}')
  @response(204, {
    description: 'CalendariosDisponibilidad PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() calendariosDisponibilidad: CalendariosDisponibilidad,
  ): Promise<void> {
    await this.calendariosDisponibilidadRepository.replaceById(id, calendariosDisponibilidad);
  }

  @del('/calendarios-disponibilidades/{id}')
  @response(204, {
    description: 'CalendariosDisponibilidad DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.calendariosDisponibilidadRepository.deleteById(id);
  }
}
