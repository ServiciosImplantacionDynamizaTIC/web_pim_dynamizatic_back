import { injectable, BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { TraduccionContenidoRepository } from '../repositories';

/**
 * Servicio para manejar las traducciones de contenido
 */
@injectable({ scope: BindingScope.SINGLETON })
export class TraduccionService {
  constructor(
    @repository(TraduccionContenidoRepository)
    public traduccionContenidoRepository: TraduccionContenidoRepository,
  ) { }

  /**
   * Aplica traducciones a un registro individual
   * @param registro - El registro a traducir
   * @param tabla - Nombre de la tabla
   * @param idiomaId - ID del idioma destino
   * @returns El registro traducido
   */
  async traducirRegistro(
    registro: any,
    tabla: string,
    idiomaId: number,
  ): Promise<any> {
    if (!registro || !registro.id) {
      return registro;
    }

    try {
      // Buscar todas las traducciones para este registro
      const traducciones = await this.traduccionContenidoRepository.find({
        where: {
          tablaReferencia: tabla,
          idReferencia: registro.id,
          idiomaId: idiomaId,
        },
      });

      // Si no hay traducciones, devolver el registro original
      if (traducciones.length === 0) {
        return registro;
      }

      // Aplicar traducciones a los campos correspondientes
      const registroTraducido = { ...registro };
      
      traducciones.forEach(trad => {
        if (registroTraducido.hasOwnProperty(trad.campo)) {
          registroTraducido[trad.campo] = trad.valor;
        }
      });

      return registroTraducido;

    } catch (error) {
      console.error(`Error al traducir registro de tabla ${tabla}:`, error);
      // En caso de error, devolver el registro original
      return registro;
    }
  }

  /**
   * Aplica traducciones a múltiples registros
   * @param registros - Array de registros a traducir
   * @param tabla - Nombre de la tabla
   * @param idiomaId - ID del idioma destino
   * @returns Array de registros traducidos
   */
  async traducirRegistros(
    registros: any[],
    tabla: string,
    idiomaId: number,
  ): Promise<any[]> {
    if (!Array.isArray(registros) || registros.length === 0) {
      return registros;
    }

    try {
      // Traducir todos los registros en paralelo para mejor rendimiento
      const registrosTraducidos = await Promise.all(
        registros.map(registro => 
          this.traducirRegistro(registro, tabla, idiomaId)
        )
      );

      return registrosTraducidos;

    } catch (error) {
      console.error(`Error al traducir registros de tabla ${tabla}:`, error);
      // En caso de error, devolver los registros originales
      return registros;
    }
  }

  /**
   * Extrae el nombre de la tabla desde el contexto del controlador
   * @param targetName - Nombre del target (controlador)
   * @returns Nombre de la tabla en formato snake_case
   */
  detectarTabla(targetName: string): string {
    // console.log('🔍 detectarTabla - targetName recibido:', targetName);
    
    let tabla = '';
    
    // Caso 1: Si viene con formato 'TablaController.prototype.metodo' 
    if (targetName.includes('.prototype.')) {
      // Extraer solo la primera parte antes del primer punto
      tabla = targetName.split('.')[0];
      // console.log('📝 Formato prototype detectado, antes de quitar Controller:', tabla);
      
      // Quitar 'Controller' de la primera parte
      tabla = tabla.replace(/Controller$/i, '');
      // console.log('📝 Después de quitar Controller:', tabla);
    }
    // Caso 2: Si viene con formato 'TablaController' o 'Tabla'
    else {
      // Quitar 'Controller' si existe al final
      tabla = targetName.replace(/Controller$/i, '');
      // console.log('📝 Después de quitar Controller:', tabla);
    }
    
    // Convertir a snake_case
    tabla = this.convertirASnakeCase(tabla);
    
    // console.log('✅ detectarTabla - tabla final:', tabla);
    return tabla;
  }

  /**
   * Convierte texto en PascalCase o CamelCase a snake_case
   * Ejemplos:
   * - Catalogo -> catalogo
   * - ConfiguracionLimpiezaLogs -> configuracion_limpieza_logs
   * - ParametroGlobal -> parametro_global
   */
  private convertirASnakeCase(texto: string): string {
    // console.log('🔄 Convirtiendo a snake_case:', texto);
    
    return texto
      // Insertar guión bajo antes de cada letra mayúscula (excepto la primera)
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      // Convertir todo a minúsculas
      .toLowerCase()
      // Limpiar guiones bajos múltiples o al inicio/final
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_');
  }

  /**
   * Procesa datos antes de guardar - redirige campos traducibles a traduccion_contenido
   * @param datos - Los datos a procesar antes de guardar
   * @param tabla - Nombre de la tabla
   * @param idiomaId - ID del idioma
   * @param operacion - Tipo de operación (create, update, patch)
   * @returns Datos procesados para guardar en tabla original
   */
  async procesarEscrituraTraduccion(
    datos: any,
    tabla: string,
    idiomaId: number,
    operacion: 'create' | 'update' | 'patch',
    idRegistro?: number
  ): Promise<any> {
    console.log('🔄 procesarEscrituraTraduccion:', { tabla, idiomaId, operacion, idRegistro });
    
    // Si es español (idioma por defecto), no hacer nada especial
    if (idiomaId === 1) {
      console.log('- Idioma español detectado, guardando en tabla original');
      return datos;
    }

    try {
      // Obtener campos traducibles de esta tabla
      const camposTraducibles = await this.obtenerCamposTraducibles(tabla);
      console.log('- Campos traducibles:', camposTraducibles);

      // Separar datos: traducibles vs no traducibles
      const datosOriginales = { ...datos };
      const datosTraducibles: any = {};

      camposTraducibles.forEach(campo => {
        if (datos.hasOwnProperty(campo)) {
          datosTraducibles[campo] = datos[campo];
          delete datosOriginales[campo]; // Quitar del objeto original
        }
      });

      console.log('- Datos traducibles extraídos:', datosTraducibles);
      console.log('- Datos para tabla original:', datosOriginales);

      // Si hay datos traducibles, manejarlos
      if (Object.keys(datosTraducibles).length > 0) {
        if (operacion === 'create') {
          // Para CREATE, necesitamos esperar a que se cree el registro para obtener el ID
          console.log('- CREATE: Los datos traducibles se procesarán después de crear el registro');
          // Retornar los datos originales y guardar los traducibles para procesarlos después
          (datosOriginales as any).__pendingTranslations = datosTraducibles;
        } else if (operacion === 'update' || operacion === 'patch') {
          // Para UPDATE/PATCH, podemos procesar inmediatamente
          await this.guardarCamposTraducibles(tabla, idRegistro!, datosTraducibles, idiomaId);
        }
      }

      return datosOriginales;

    } catch (error) {
      console.error('❌ Error procesando escritura de traducción:', error);
      // En caso de error, devolver datos originales sin modificar
      return datos;
    }
  }

  /**
   * Procesa las traducciones pendientes después de un CREATE
   */
  async procesarTraduccionesPendientes(
    tabla: string,
    idRegistro: number,
    datosOriginales: any,
    idiomaId: number
  ): Promise<void> {
    if (datosOriginales.__pendingTranslations) {
      console.log('🔄 Procesando traducciones pendientes para ID:', idRegistro);
      await this.guardarCamposTraducibles(
        tabla, 
        idRegistro, 
        datosOriginales.__pendingTranslations, 
        idiomaId
      );
    }
  }

  /**
   * Guarda campos traducibles en la tabla traduccion_contenido
   */
  private async guardarCamposTraducibles(
    tabla: string,
    idRegistro: number,
    campos: any,
    idiomaId: number
  ): Promise<void> {
    console.log('💾 Guardando campos traducibles:', { tabla, idRegistro, campos, idiomaId });

    for (const [nombreCampo, valor] of Object.entries(campos)) {
      try {
        // Buscar si ya existe una traducción para este campo
        const traduccionExistente = await this.traduccionContenidoRepository.findOne({
          where: {
            tablaReferencia: tabla,
            idReferencia: idRegistro,
            campo: nombreCampo,
            idiomaId: idiomaId
          }
        });

        if (traduccionExistente) {
          // Actualizar traducción existente
          await this.traduccionContenidoRepository.updateById(traduccionExistente.id, {
            valor: valor as string,
            usuarioModificacion: 1, // TODO: Obtener del contexto
          });
          console.log(`✅ Actualizada traducción: ${tabla}.${nombreCampo} [${idRegistro}] = ${valor}`);
        } else {
          // Crear nueva traducción
          await this.traduccionContenidoRepository.create({
            tablaReferencia: tabla,
            idReferencia: idRegistro,
            campo: nombreCampo,
            idiomaId: idiomaId,
            valor: valor as string,
            usuarioCreacion: 1, // TODO: Obtener del contexto
          });
          console.log(`✅ Creada traducción: ${tabla}.${nombreCampo} [${idRegistro}] = ${valor}`);
        }
      } catch (error) {
        console.error(`❌ Error guardando campo ${nombreCampo}:`, error);
      }
    }
  }

  /**
   * Obtiene los campos traducibles de una tabla basándose en traducciones existentes
   */
  private async obtenerCamposTraducibles(tabla: string): Promise<string[]> {
    try {
      // Obtener campos únicos que ya tienen traducciones para esta tabla
      const traduccionesExistentes = await this.traduccionContenidoRepository.execute(
        `SELECT DISTINCT campo FROM traduccion_contenido WHERE tablaReferencia = ?`,
        [tabla]
      );

      const camposExistentes = traduccionesExistentes.map((row: any) => row.campo);
      console.log(`- Campos traducibles encontrados para ${tabla}:`, camposExistentes);

      // Si no hay campos existentes, usar campos comunes por defecto
      if (camposExistentes.length === 0) {
        const camposComunes = ['nombre', 'titulo', 'descripcion', 'nombrePlantilla', 'contenido', 'texto'];
        console.log(`- No hay traducciones existentes, usando campos comunes:`, camposComunes);
        return camposComunes;
      }

      return camposExistentes;
      
    } catch (error) {
      console.error('Error obteniendo campos traducibles:', error);
      // Fallback a campos comunes
      return ['nombre', 'titulo', 'descripcion', 'nombrePlantilla', 'contenido', 'texto'];
    }
  }

  /**
   * Verifica si un resultado debe ser procesado para traducciones
   * @param data - Los datos a verificar
   * @returns true si los datos deben ser procesados
   */
  debeProcesarTraduccion(data: any): boolean {
    if (!data) return false;
    
    // Procesar si es un array de objetos
    if (Array.isArray(data) && data.length > 0) {
      return typeof data[0] === 'object' && data[0].id !== undefined;
    }
    
    // Procesar si es un objeto con id
    if (typeof data === 'object' && data.id !== undefined) {
      return true;
    }
    
    return false;
  }
}