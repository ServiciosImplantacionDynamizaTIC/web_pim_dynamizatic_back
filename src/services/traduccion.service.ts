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