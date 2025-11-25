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
import { TraduccionContenidoRepository, TraduccionExclusionesRepository } from '../repositories';

export class TraduccionContenidoController {
  constructor(
    @repository(TraduccionContenidoRepository)
    public traduccionContenidoRepository: TraduccionContenidoRepository,
    @repository(TraduccionExclusionesRepository)
    public traduccionExclusionesRepository: TraduccionExclusionesRepository,
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

  // ia gratis
  private async translateMyMemory(text: string, targetLang: string): Promise<string> {
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
  async translateMyMemoryEndpoint(
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
      const translated = await this.translateMyMemory(body.text, body.targetLanguage);

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
      const tablasBD = await this.obtenerTablasYSusColumnasTraducibles()
      return tablasBD

    } catch (error) {
      console.log(`Ha ocurrido una excepcion: ${error}`)
      return JSON.parse('{"status":"ERROR","mensaje":"ERROR: Ha ocurrido una excepcion."}')

    }
  }


  /** R E T O R N A - T A B L A S - Y - S U S - C O L U M N A S - T R A D U C I B L E S **/
  async obtenerTablasYSusColumnasTraducibles() {
    try {
      // Obtener exclusiones de columnas de la TABLA DE EXCLUSIONES
      const exclusionesColumnas = await this.traduccionExclusionesRepository.find({
        where: {
          tipoExclusion: 'COLUMNA',
          activoSn: 'S'
        }
      });

      // Convertir a array de strings en minúsculas para comparación case-insensitive
      const columnasExcluidas = exclusionesColumnas.map((row: any) => row.valor.toLowerCase());

      // Consulta TODAS LAS TABLAS y Obtiene solo columnas de tipo texto que son traducibles (solo tablas, sin vistas)
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
       -- Filtrar solo columnas de tipo texto que pueden contener contenido traducible
       AND c.DATA_TYPE IN ('varchar', 'text', 'mediumtext', 'longtext', 'char')
       -- Excluir vistas, solo obtener tablas reales
       AND t.TABLE_TYPE = 'BASE TABLE'
       ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION`
      );

      // Filtrar columnas excluidas
      const columnasFiltradas = resultConsultaCompletaBD.filter((row: any) => {
        const nombreDeColumna = row.columnName.toLowerCase();
        // Solo incluir si NO está en la lista de exclusiones
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

}

