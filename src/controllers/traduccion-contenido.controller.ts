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
import { TraduccionContenido } from '../models/traduccion-contenido.model';
import { TraduccionContenidoRepository, TraduccionExclusionesRepository, IdiomaRepository } from '../repositories';

export class TraduccionContenidoController {
  constructor(
    @repository(TraduccionContenidoRepository)
    public traduccionContenidoRepository: TraduccionContenidoRepository,
    @repository(TraduccionExclusionesRepository)
    public traduccionExclusionesRepository: TraduccionExclusionesRepository,
    @repository(IdiomaRepository)
    public idiomaRepository: IdiomaRepository,
  ) { }

  @post('/traduccion-contenidos')
  @response(200, {
    description: 'TraduccionContenido model instance',
    content: { 'application/json': { schema: getModelSchemaRef(TraduccionContenido) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionContenido, {
            title: 'NewTraduccionContenido',
            exclude: ['id'],
          }),
        },
      },
    })
    traduccionContenido: Omit<TraduccionContenido, 'id'>,
  ): Promise<TraduccionContenido> {
    return this.traduccionContenidoRepository.create(traduccionContenido);
  }

  @get('/traduccion-contenidos/count')
  @response(200, {
    description: 'TraduccionContenido model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(TraduccionContenido) where?: Where<TraduccionContenido>,
  ): Promise<Count> {
    return this.traduccionContenidoRepository.count(where);
  }

  @get('/traduccion-contenidos')
  @response(200, {
    description: 'Array of TraduccionContenido model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TraduccionContenido, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(TraduccionContenido) filter?: Filter<TraduccionContenido>,
  ): Promise<TraduccionContenido[]> {
    return this.traduccionContenidoRepository.find(filter);
  }

  @patch('/traduccion-contenidos')
  @response(200, {
    description: 'TraduccionContenido PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionContenido, { partial: true }),
        },
      },
    })
    traduccionContenido: TraduccionContenido,
    @param.where(TraduccionContenido) where?: Where<TraduccionContenido>,
  ): Promise<Count> {
    return this.traduccionContenidoRepository.updateAll(traduccionContenido, where);
  }

  @get('/traduccion-contenidos/{id}')
  @response(200, {
    description: 'TraduccionContenido model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TraduccionContenido, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TraduccionContenido, { exclude: 'where' }) filter?: FilterExcludingWhere<TraduccionContenido>
  ): Promise<TraduccionContenido> {
    return this.traduccionContenidoRepository.findById(id, filter);
  }

  @patch('/traduccion-contenidos/{id}')
  @response(204, {
    description: 'TraduccionContenido PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TraduccionContenido, { partial: true }),
        },
      },
    })
    traduccionContenido: TraduccionContenido,
  ): Promise<void> {
    await this.traduccionContenidoRepository.updateById(id, traduccionContenido);
  }

  @put('/traduccion-contenidos/{id}')
  @response(204, {
    description: 'TraduccionContenido PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() traduccionContenido: TraduccionContenido,
  ): Promise<void> {
    await this.traduccionContenidoRepository.replaceById(id, traduccionContenido);
  }

  @del('/traduccion-contenidos/{id}')
  @response(204, {
    description: 'TraduccionContenido DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.traduccionContenidoRepository.deleteById(id);
  }


  // T R A D U C C I O N - D E - C O N T E N I D O - U S A N D O - O P E N A I
  // private async callOpenAI(text: string, targetLanguage: string): Promise<string> {
  //   try {
  //     const request = require('request');

  //     const endpoint = "https://api.openai.com/v1";
  //     const apiKey = process.env.OPENAI_API_KEY || ""; // Tu API key desde .env

  //     const languageNames: { [key: string]: string } = {
  //       en: 'English',
  //       de: 'German',
  //       it: 'Italian',
  //     };

  //     const body = {
  //       model: "gpt-3.5-turbo", // O "gpt-4" para mejor calidad
  //       messages: [
  //         {
  //           role: "system",
  //           content: `You are a professional translator. Translate from Spanish to ${languageNames[targetLanguage]}. Return ONLY the translation, no explanations.`
  //         },
  //         {
  //           role: "user",
  //           content: text
  //         }
  //       ],
  //       temperature: 0.3,
  //       max_tokens: 500,
  //     };

  //     return new Promise((resolve, reject) => {
  //       const options = {
  //         method: 'POST',
  //         url: `${endpoint}/chat/completions`,
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${apiKey}`
  //         },
  //         body: JSON.stringify(body)
  //       };

  //       console.log('🔄 Llamando a OpenAI...', {
  //         texto: text,
  //         idioma: targetLanguage
  //       });

  //       request(options, function (error: string | null, response: { body: string }) {
  //         if (error) {
  //           console.error('❌ Error en la solicitud:', error);
  //           return reject(error);
  //         }

  //         try {
  //           const data = JSON.parse(response.body);

  //           // Verificar si hay error en la respuesta
  //           if (data.error) {
  //             console.error('❌ Error de OpenAI:', data.error);
  //             return reject(new Error(data.error.message || 'Error desconocido de OpenAI'));
  //           }

  //           const texto = data.choices?.[0]?.message?.content;

  //           if (texto) {
  //             console.log('✅ Traducción exitosa');
  //             resolve(texto.trim());
  //           } else {
  //             console.error('❌ Respuesta vacía desde OpenAI');
  //             reject(new Error('Respuesta vacía desde OpenAI'));
  //           }
  //         } catch (err) {
  //           console.error('❌ Error al parsear JSON:', err);
  //           reject(err);
  //         }
  //       });
  //     });
  //   } catch (error) {
  //     console.error('❌ Error en callOpenAI:', error);
  //     throw new Error('Error al llamar a OpenAI: ' + error);
  //   }
  // }

  // T R A D U C C I O N - D E - C O N T E N I D O - U S A N D O - M Y M E M O R Y - (Es hibrido - usa Diccionario Gigante de traducciones + IA)
  private async traducirTexto(text: string, targetLang: string): Promise<string> {
    const request = require('request');

    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.mymemory.translated.net/get`,
        qs: {
          q: text,
          langpair: `es|${targetLang}`
        }
      };

      request(options, function (error: any, response: { body: string }) {
        if (error) return reject(error);

        try {
          const data = JSON.parse(response.body);
          
          // Si hay un error de idiomas iguales, devolver el texto original
          if (data.responseData && data.responseData.translatedText === 'PLEASE SELECT TWO DISTINCT LANGUAGES') {
            return resolve(text);
          }
          
          resolve(data.responseData.translatedText);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Traduce un texto usando MyMemory (IA gratuita)
   */
  @post('/translate/mymemory')
  @response(200, {
    description: 'Traducción exitosa',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            original: { type: 'string' },
            translated: { type: 'string' },
            targetLang: { type: 'string' },
            service: { type: 'string' },
          },
        },
      },
    },
  })
  async traducirTextoEndpoint(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['text', 'targetLanguage'],
            properties: {
              text: { type: 'string' },
              targetLanguage: {
                type: 'string',
                description: 'Código del idioma destino (ej: en, de, it, fr)',
              },
            },
          },
        },
      },
    })
    body: {
      text: string;
      targetLanguage: string;
    },
  ): Promise<{
    original: string;
    translated: string;
    targetLang: string;
    service: string;
  }> {
    try {
      const translated = await this.traducirTexto(body.text, body.targetLanguage);

      return {
        original: body.text,
        translated: translated,
        targetLang: body.targetLanguage,
        service: 'MyMemory',
      };
    } catch (error) {
      console.error('Error en traducción MyMemory:', error);
      throw error;
    }
  }


  //** T R A D U C I R - C O N T E N I D O - C O N - I A **// -> M E T O D O - M A N U A L **//
  @get('/traducirContenidoConIA_manual')
  @response(200, {
    description: 'Traduce textos del contenido usando IA - Proceso Manual',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async traducirContenidoConIAManual() {

    return this.proceso()

  }

  //** T R A D U C I R - C O N T E N I D O - C O N - I A **// -> M E T O D O - A U T O M A T I C O **//
  @get('/traducirContenidoConIA')
  @response(200, {
    description: 'Traduce textos del contenido usando IA - Proceso automático nocturno',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async traducirContenidoConIA() {
    process.hrtime = require('browser-process-hrtime')
    const cron = require('node-cron')
    cron.schedule("0 1 * * *", async () => {

      return this.proceso()

    }, {
      scheduled: true,
      timezone: "Europe/Madrid"
    })
  }

  async proceso() {
    try {
      // Obtengo la estructura de tablas y columnas traducibles
      const tablasBD = await this.obtenerTablasYSusColumnasTraducibles()
      // Proceso los registros modificados en las últimas 24h
      const registrosPendientesTraduccion = await this.obtenerRegistrosPendientesTraduccion(tablasBD);

      return {
        status: 'SUCCESS',
        estructura: tablasBD,
        registrosPendientes: registrosPendientesTraduccion
      };

    } catch (error) {
      console.log(`Ha ocurrido una excepcion: ${error}`)
      return JSON.parse('{"status":"ERROR","mensaje":"ERROR: Ha ocurrido una excepcion."}')

    }
  }


  /** R E T O R N A - T A B L A S - Y - S U S - C O L U M N A S - T R A D U C I B L E S (texto y BLOB) **/
  async obtenerTablasYSusColumnasTraducibles() {
    try {
      // Obtener exclusiones de COLUMNAS de la TABLA DE EXCLUSIONES
      const exclusionesColumnas = await this.traduccionExclusionesRepository.find({
        where: {
          tipoExclusion: 'COLUMNA',
          activoSn: 'S'
        }
      });

      // Convertir a array de strings en minúsculas para comparación case-insensitive
      const columnasExcluidas = exclusionesColumnas.map((row: any) => row.valor.toLowerCase());

      // Obtener exclusiones de TABLAS de la TABLA DE EXCLUSIONES
      const exclusionesTablas = await this.traduccionExclusionesRepository.find({
        where: {
          tipoExclusion: 'TABLA',
          activoSn: 'S'
        }
      });

      // Convertir a array de strings en minúsculas para comparación case-insensitive
      const tablasExcluidas = exclusionesTablas.map((row: any) => row.valor.toLowerCase());


      // Consulta TODAS LAS TABLAS y Obtiene solo columnas de tipo texto y BLOB que son traducibles (solo tablas, sin vistas)
      const resultConsultaCompletaBD = await this.traduccionContenidoRepository.execute(
        `SELECT 
        c.TABLE_NAME as tableName,
        c.COLUMN_NAME as columnName,
        c.DATA_TYPE as dataType
       FROM INFORMATION_SCHEMA.COLUMNS c
       -- Join con TABLES para poder filtrar por tipo de objeto
       INNER JOIN INFORMATION_SCHEMA.TABLES t 
         ON c.TABLE_SCHEMA = t.TABLE_SCHEMA 
         AND c.TABLE_NAME = t.TABLE_NAME
       WHERE c.TABLE_SCHEMA = DATABASE()
       -- Filtrar columnas de tipo texto y BLOB que pueden contener contenido traducible
       AND c.DATA_TYPE IN ('varchar', 'text', 'mediumtext', 'longtext', 'char', 'blob', 'tinyblob', 'mediumblob', 'longblob')
       -- Excluir vistas, solo obtener tablas reales
       AND t.TABLE_TYPE = 'BASE TABLE'
       ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION`
      );

      // Filtrar TABLAS excluidas primero
      const registrosSinTablasExcluidas = resultConsultaCompletaBD.filter((row: any) => {
        const nombreDeTabla = row.tableName.toLowerCase();
        // Solo incluir si la tabla NO está en la lista de exclusiones
        return !tablasExcluidas.includes(nombreDeTabla);
      });

      // Filtrar COLUMNAS excluidas
      const columnasFiltradas = registrosSinTablasExcluidas.filter((row: any) => {
        const nombreDeColumna = row.columnName.toLowerCase();
        // Solo incluir si la columna NO está en la lista de exclusiones
        return !columnasExcluidas.includes(nombreDeColumna);
      });

      // Agrupar por tabla
      const estructuraBD: any = {};

      columnasFiltradas.forEach((row: any) => {
        if (!estructuraBD[row.tableName]) {
          estructuraBD[row.tableName] = [];
        }
        estructuraBD[row.tableName].push(row.columnName);
      });

      // Eliminar tablas que quedaron sin columnas traducibles
      const tablasConColumnasTraducibles: any = {};
      for (const [tabla, columnas] of Object.entries(estructuraBD)) {
        if ((columnas as string[]).length > 0) {
          tablasConColumnasTraducibles[tabla] = columnas;
        }
      }

      return tablasConColumnasTraducibles;
    } catch (error) {
      console.log(`Ha ocurrido una excepcion: ${error}`)
      return JSON.parse('{"status":"ERROR","mensaje":"ERROR: Ha ocurrido una excepcion."}')
    }
  }

  /** O B T E N E R - R E G I S T R O S - P E N D I E N T E S - D E - T R A D U C C I O N **/
  async obtenerRegistrosPendientesTraduccion(estructuraBD: any) {
    try {
      const traducciones: any[] = [];

      // Obtener todos los idiomas activos del sistema
      const idiomas = await this.idiomaRepository.find({
        where: { activoSn: 'S' }
      });

      console.log(`Idiomas activos en el sistema: ${idiomas.length}`);

      // Recorrer cada tabla y sus columnas
      for (const [nombreTabla, columnas] of Object.entries(estructuraBD)) {
        console.log(`Procesando tabla: ${nombreTabla}`);

        // Verificar si la tabla tiene el campo fechaModificacion
        const tieneFechaModificacion = await this.verificarCampoExiste(nombreTabla, 'fechaModificacion');

        let registrosModificados: any[] = [];

        if (tieneFechaModificacion) {
          // Obtener registros modificados en las últimas 24h O con fechaModificacion NULL (registros nuevos)
          const resultado = await this.traduccionContenidoRepository.execute(
            `SELECT * FROM ${nombreTabla} 
               WHERE fechaModificacion >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
               OR fechaModificacion IS NULL`
          );
          registrosModificados = Array.isArray(resultado) ? resultado : [];
        } else {
          // Si no tiene fechaModificacion, obtener todos los registros
          const resultado = await this.traduccionContenidoRepository.execute(
            `SELECT * FROM ${nombreTabla}`
          );
          registrosModificados = Array.isArray(resultado) ? resultado : [];
        }

        console.log(`Registros a procesar en ${nombreTabla}: ${registrosModificados.length}`);

        // Procesar cada registro modificado
        for (const registro of registrosModificados) {
          const idRegistro = registro.id;

          // Procesar cada columna traducible del registro
          for (const nombreColumna of columnas as string[]) {
            let valorCampo = registro[nombreColumna];

            // Convertir datos BLOB a string si es necesario
            valorCampo = this.procesarValorCampo(valorCampo);

            // Solo procesar si el campo tiene valor
            if (valorCampo && valorCampo.trim() !== '') {
              console.log(`✅ Procesando el valor del campo: ${valorCampo}`)
              // Procesar para cada idioma del sistema
              for (const idioma of idiomas) {
                // Validar que el idioma tenga código ISO
                if (!idioma.iso) {
                  console.log(`Idioma ${idioma.nombre} no tiene código ISO, omitiendo...`);
                  continue;
                }

                console.log(`Verificando traducción para idioma: ${idioma.nombre} (${idioma.iso})`);

                // Verificar si ya existe traducción para este idioma
                const traduccionExistente = await this.traduccionContenidoRepository.findOne({
                  where: {
                    tablaReferencia: nombreTabla,
                    idReferencia: idRegistro,
                    campo: nombreColumna,
                    idiomaId: idioma.id
                  }
                });

                // CASO 1: NO EXISTE la traducción para este idioma
                if (!traduccionExistente) {
                  console.log(`No existe traducción para ${nombreTabla}.${nombreColumna} [ID: ${idRegistro}] en idioma ${idioma.nombre}`);

                  // Verificar si el valor está en exclusiones
                  const exclusion = await this.verificarExclusion(valorCampo);

                  if (exclusion.esValorExacto) {
                    // Es un valor exacto excluido - insertar sin traducir
                    console.log(`Valor exacto excluido, insertando sin traducir`);
                    traducciones.push({
                      tablaReferencia: nombreTabla,
                      idReferencia: idRegistro,
                      campo: nombreColumna,
                      idiomaId: idioma.id,
                      valor: valorCampo,
                      accion: 'INSERT_SIN_TRADUCIR',
                      motivo: 'VALOR_EXACTO_EXCLUIDO'
                    });
                  } else if (exclusion.tieneTextoContenido) {
                    // Contiene texto excluido - traducir excluyendo ese texto
                    console.log(`Contiene texto excluido, traduciendo parcialmente`);

                    const valorTraducido = await this.traducirConExclusion(
                      valorCampo,
                      exclusion.textosExcluidos,
                      idioma.iso
                    );

                    traducciones.push({
                      tablaReferencia: nombreTabla,
                      idReferencia: idRegistro,
                      campo: nombreColumna,
                      idiomaId: idioma.id,
                      valor: valorTraducido,
                      accion: 'INSERT_CON_TRADUCCION_PARCIAL',
                      motivo: 'TEXTO_CONTENIDO_EXCLUIDO'
                    });
                  } else {
                    // No está excluido - traducir completamente
                    console.log(`Valor no excluido, traduciendo completamente`);

                    const valorTraducido = await this.traducirTexto(
                      valorCampo,
                      idioma.iso
                    );

                    traducciones.push({
                      tablaReferencia: nombreTabla,
                      idReferencia: idRegistro,
                      campo: nombreColumna,
                      idiomaId: idioma.id,
                      valor: valorTraducido,
                      accion: 'INSERT_CON_TRADUCCION_COMPLETA',
                      motivo: 'NO_EXISTE_TRADUCCION'
                    });
                  }
                }
                // CASO 2: EXISTE pero fechaModificacion es null o vacía
                else if (!traduccionExistente.fechaModificacion) {
                  console.log(`Existe traducción pero fechaModificacion vacía para ${nombreTabla}.${nombreColumna} [ID: ${idRegistro}] en idioma ${idioma.nombre}`);

                  // Verificar si el valor está en exclusiones
                  const exclusion = await this.verificarExclusion(valorCampo);

                  if (exclusion.esValorExacto) {
                    // Es un valor exacto excluido - actualizar sin traducir
                    console.log(`Valor exacto excluido, actualizando sin traducir`);
                    traducciones.push({
                      id: traduccionExistente.id,
                      tablaReferencia: nombreTabla,
                      idReferencia: idRegistro,
                      campo: nombreColumna,
                      idiomaId: idioma.id,
                      valor: valorCampo,
                      accion: 'UPDATE_SIN_TRADUCIR',
                      motivo: 'VALOR_EXACTO_EXCLUIDO_Y_FECHA_VACIA'
                    });
                  } else if (exclusion.tieneTextoContenido) {
                    // Contiene texto excluido - traducir excluyendo ese texto
                    console.log(`Contiene texto excluido, traduciendo parcialmente`);

                    const valorTraducido = await this.traducirConExclusion(
                      valorCampo,
                      exclusion.textosExcluidos,
                      idioma.iso
                    );

                    traducciones.push({
                      id: traduccionExistente.id,
                      tablaReferencia: nombreTabla,
                      idReferencia: idRegistro,
                      campo: nombreColumna,
                      idiomaId: idioma.id,
                      valor: valorTraducido,
                      accion: 'UPDATE_CON_TRADUCCION_PARCIAL',
                      motivo: 'TEXTO_CONTENIDO_EXCLUIDO_Y_FECHA_VACIA'
                    });
                  } else {
                    // No está excluido - traducir completamente
                    console.log(`Valor no excluido, traduciendo completamente`);

                    const valorTraducido = await this.traducirTexto(
                      valorCampo,
                      idioma.iso
                    );

                    traducciones.push({
                      id: traduccionExistente.id,
                      tablaReferencia: nombreTabla,
                      idReferencia: idRegistro,
                      campo: nombreColumna,
                      idiomaId: idioma.id,
                      valor: valorTraducido,
                      accion: 'UPDATE_CON_TRADUCCION_COMPLETA',
                      motivo: 'FECHA_MODIFICACION_VACIA'
                    });
                  }
                }
                // CASO 3: EXISTE y tiene fechaModificacion - No hacer nada
                else {
                  console.log(`Ya existe traducción válida para ${nombreTabla}.${nombreColumna} [ID: ${idRegistro}] en idioma ${idioma.nombre}`);
                }
              }
            }
          }
        }
      }

      // Realizar las inserciones y actualizaciones
      for (const traduccion of traducciones) {
        if (traduccion.accion.startsWith('INSERT')) {
          await this.traduccionContenidoRepository.create({
            tablaReferencia: traduccion.tablaReferencia,
            idReferencia: traduccion.idReferencia,
            campo: traduccion.campo,
            idiomaId: traduccion.idiomaId,
            valor: traduccion.valor,
            usuarioCreacion: 1
          });
          console.log(`✅ Insertado: ${traduccion.tablaReferencia}.${traduccion.campo} [ID: ${traduccion.idReferencia}] - Idioma: ${traduccion.idiomaId}`);
        } else if (traduccion.accion.startsWith('UPDATE')) {
          await this.traduccionContenidoRepository.updateById(traduccion.id, {
            valor: traduccion.valor,
            usuarioModificacion: 1
          });
          console.log(`✅ Actualizado: ${traduccion.tablaReferencia}.${traduccion.campo} [ID: ${traduccion.idReferencia}] - Idioma: ${traduccion.idiomaId}`);
        }
      }

      return {
        totalProcesados: traducciones.length,
        traducciones: traducciones
      };

    } catch (error) {
      console.log(`Error al obtener registros pendientes: ${error}`);
      throw error;
    }
  }

  /** V E R I F I C A R - S I - C A M P O - E X I S T E - E N - T A B L A **/
  async verificarCampoExiste(nombreTabla: string, nombreCampo: string): Promise<boolean> {
    try {
      const resultado = await this.traduccionContenidoRepository.execute(
        `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = ? 
       AND COLUMN_NAME = ?`,
        [nombreTabla, nombreCampo]
      );

      return resultado.length > 0;

    } catch (error) {
      console.log(`Error al verificar campo: ${error}`);
      return false;
    }
  }

  /** V E R I F I C A R - E S T A D O - D E - T R A D U C C I O N **/
  async verificarEstadoTraduccion(
    tablaReferencia: string,
    idReferencia: number,
    campo: string
  ) {
    try {
      // Buscar si existe traducción para este registro y campo usando el repositorio
      const traduccionExistente = await this.traduccionContenidoRepository.find({
        where: {
          tablaReferencia: tablaReferencia,
          idReferencia: idReferencia,
          campo: campo
        }
      });

      // NO EXISTE: Requiere traducción
      if (traduccionExistente.length === 0) {
        return {
          requiereTraduccion: true,
          motivo: 'NO_EXISTE',
          accion: 'INSERT'
        };
      }

      // Verificar cada traducción existente (puede haber múltiples idiomas)
      let requiereActualizacion = false;

      for (const traduccion of traduccionExistente) {
        // EXISTE pero fechaModificacion está vacía: Requiere traducción
        if (!traduccion.fechaModificacion || traduccion.fechaModificacion === null) {
          requiereActualizacion = true;
          break;
        }
      }

      if (requiereActualizacion) {
        return {
          requiereTraduccion: true,
          motivo: 'FECHA_MODIFICACION_VACIA',
          accion: 'UPDATE'
        };
      }

      // EXISTE y tiene fechaModificacion: NO requiere traducción
      return {
        requiereTraduccion: false,
        motivo: 'YA_TRADUCIDO',
        accion: 'NINGUNA'
      };

    } catch (error) {
      console.log(`Error al verificar estado de traducción: ${error}`);
      return {
        requiereTraduccion: false,
        motivo: 'ERROR',
        accion: 'NINGUNA'
      };
    }
  }

  /** V E R I F I C A R - E X C L U S I O N **/
  async verificarExclusion(texto: string): Promise<{
    esValorExacto: boolean;
    tieneTextoContenido: boolean;
    textosExcluidos: string[];
  }> {
    try {
      if (!texto || texto.trim() === '') {
        return {
          esValorExacto: false,
          tieneTextoContenido: false,
          textosExcluidos: []
        };
      }

      // 1. Verificar exclusiones de valores exactos
      const valoresExactos = await this.traduccionExclusionesRepository.find({
        where: {
          tipoExclusion: 'VALOR_EXACTO',
          activoSn: 'S'
        }
      });

      const textoTrim = texto.trim();
      for (const exclusion of valoresExactos) {
        if (textoTrim === exclusion.valor) {
          console.log(`Texto "${texto}" coincide exactamente con valor excluido: "${exclusion.valor}"`);
          return {
            esValorExacto: true,
            tieneTextoContenido: false,
            textosExcluidos: []
          };
        }
      }

      // 2. Verificar exclusiones de texto contenido
      const textosContenidos = await this.traduccionExclusionesRepository.find({
        where: {
          tipoExclusion: 'TEXTO_CONTENIDO',
          activoSn: 'S'
        }
      });

      const textosEncontrados: string[] = [];
      for (const exclusion of textosContenidos) {
        if (texto.includes(exclusion.valor)) {
          console.log(`Texto "${texto}" contiene valor excluido: "${exclusion.valor}"`);
          textosEncontrados.push(exclusion.valor);
        }
      }

      if (textosEncontrados.length > 0) {
        return {
          esValorExacto: false,
          tieneTextoContenido: true,
          textosExcluidos: textosEncontrados
        };
      }

      // Si no coincide con ninguna exclusión
      return {
        esValorExacto: false,
        tieneTextoContenido: false,
        textosExcluidos: []
      };

    } catch (error) {
      console.log(`Error al verificar exclusión: ${error}`);
      return {
        esValorExacto: false,
        tieneTextoContenido: false,
        textosExcluidos: []
      };
    }
  }

  /** T R A D U C I R - C O N - E X C L U S I O N **/
  async traducirConExclusion(
    texto: string,
    textosExcluidos: string[],
    idiomaDestino: string
  ): Promise<string> {
    try {
      // Crear un mapa de reemplazos temporales
      const placeholders: { [key: string]: string } = {};
      let textoModificado = texto;

      // Reemplazar textos excluidos con placeholders
      textosExcluidos.forEach((textoExcluido, index) => {
        const placeholder = `__PLACEHOLDER_${index}__`;
        placeholders[placeholder] = textoExcluido;
        textoModificado = textoModificado.replace(textoExcluido, placeholder);
      });

      // Traducir el texto con placeholders
      const textoTraducido = await this.traducirTexto(textoModificado, idiomaDestino);

      // Restaurar los textos excluidos
      let textoFinal = textoTraducido;
      for (const [placeholder, textoOriginal] of Object.entries(placeholders)) {
        textoFinal = textoFinal.replace(placeholder, textoOriginal);
      }

      return textoFinal;

    } catch (error) {
      console.log(`Error al traducir con exclusión: ${error}`);
      throw error;
    }
  }

  /**
   * Traduce un texto usando OpenAI
   */
  // @post('/translate/openai')
  // async translateOpenAI(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: {
  //           type: 'object',
  //           required: ['text', 'targetLanguage'],
  //           properties: {
  //             text: {type: 'string'},
  //             targetLanguage: {
  //               type: 'string',
  //               enum: ['en', 'de', 'it'],
  //             },
  //           },
  //         },
  //       },
  //     },
  //   })
  //   body: {
  //     text: string;
  //     targetLanguage: string;
  //   },
  // ): Promise<{
  //   original: string;
  //   translated: string;
  //   targetLang: string;
  //   service: string;
  //   tokensUsed?: number;
  // }> {
  //   try {
  //     const translated = await this.callOpenAI(body.text, body.targetLanguage);

  //     return {
  //       original: body.text,
  //       translated: translated,
  //       targetLang: body.targetLanguage,
  //       service: 'OpenAI',
  //     };
  //   } catch (error) {
  //     console.error('Error en traducción:', error);
  //     return {status: 'ERROR', mensaje: error.message};
  //   }
  // }

  /** P R O C E S A R - V A L O R - C A M P O (incluye conversión BLOB a string) **/
  private procesarValorCampo(valor: any): string {
    try {
      // Si es null, undefined o vacío, retornar string vacío
      if (valor === null || valor === undefined) {
        return '';
      }

      // Si ya es string, retornar directamente
      if (typeof valor === 'string') {
        return valor;
      }

      // Si es Buffer (datos BLOB), convertir a string UTF-8
      if (Buffer.isBuffer(valor)) {
        console.log('🔄 Convirtiendo datos BLOB a string...');
        return valor.toString('utf8');
      }

      // Si es un array de bytes (Uint8Array), convertir a Buffer y luego a string
      if (valor instanceof Uint8Array) {
        console.log('🔄 Convirtiendo Uint8Array BLOB a string...');
        return Buffer.from(valor).toString('utf8');
      }

      // Si es otro tipo de objeto, intentar convertir a string
      if (typeof valor === 'object') {
        console.log('🔄 Convirtiendo objeto a string...');
        return JSON.stringify(valor);
      }

      // Para cualquier otro tipo, convertir a string
      return String(valor);

    } catch (error) {
      console.error('❌ Error al procesar valor del campo:', error);
      // En caso de error, retornar string vacío para evitar fallos
      return '';
    }
  }

}

