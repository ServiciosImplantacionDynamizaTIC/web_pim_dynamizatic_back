import {
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import { Request, RestBindings } from '@loopback/rest';
import { TraduccionService } from '../services/traduccion.service';

/**
 * Interceptor para aplicar traducciones automáticamente a todas las respuestas de la API
 * Basado en el idioma especificado en el header 'x-idioma-id'
 */
export class TraduccionInterceptor implements Provider<Interceptor> {
  constructor(
    @inject('services.TraduccionService')
    private traduccionService: TraduccionService,
  ) {}

  /**
   * Retorna la función interceptor
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * Función principal del interceptor
   * @param invocationCtx - Contexto de la invocación
   * @param next - Función para continuar con la siguiente función
   * @returns Resultado traducido o original
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    console.log('🚀 ¡¡¡ INTERCEPTOR EJECUTÁNDOSE !!!');
    console.log('- Target Name:', invocationCtx.targetName);
    console.log('- Method Name:', invocationCtx.methodName);
    
    try {
      // Ejecutar la consulta original primero
      const result = await next();
      
      // Obtener idioma del contexto (headers, parámetros, etc.)
      const idiomaId = this.getIdiomaFromContext(invocationCtx);
      
      // Debug: Agregar logs para verificar funcionamiento
      console.log('🔍 TraduccionInterceptor - Debug Info:');
      console.log('- Endpoint:', invocationCtx.targetName);
      console.log('- IdiomaId extraído:', idiomaId);
      console.log('- Resultado existe:', !!result);
      console.log('- Tipo de resultado:', Array.isArray(result) ? 'Array' : typeof result);
      
      // Si no hay resultado, es el idioma por defecto (español = 1) o no se especifica idioma, 
      // retornar sin traducir
      if (!result || !idiomaId || idiomaId === 1) {
        console.log('- ❌ No se aplicarán traducciones (idioma 1 o no especificado)');
        return result;
      }

      // Verificar si el resultado debe ser procesado para traducciones
      if (!this.traduccionService.debeProcesarTraduccion(result)) {
        console.log('- ❌ El resultado no necesita procesamiento de traducción');
        return result;
      }

      // Detectar el nombre de la tabla desde el modelo/repositorio
      const nombreTabla = await this.detectarTablaDesdeContexto(invocationCtx);
      console.log('- 📋 Tabla detectada:', nombreTabla);
      
      if (!nombreTabla) {
        console.log('- ❌ No se pudo detectar el nombre de la tabla');
        return result;
      }
      
      // Aplicar traducciones según el tipo de datos
      console.log('- ✅ Aplicando traducciones...');
      const resultadoTraducido = await this.aplicarTraducciones(result, nombreTabla, idiomaId);
      console.log('- 🎉 Traducciones aplicadas exitosamente');
      
      return resultadoTraducido;

    } catch (error) {
      console.error('Error en TraduccionInterceptor:', error);
      // En caso de error, devolver el resultado original
      return next();
    }
  }

  /**
   * Aplica traducciones al resultado según su tipo
   * @param data - Los datos a traducir
   * @param nombreTabla - Nombre de la tabla
   * @param idiomaId - ID del idioma destino
   * @returns Datos traducidos
   */
  private async aplicarTraducciones(
    data: any,
    nombreTabla: string,
    idiomaId: number,
  ): Promise<any> {
    // Si es un array, traducir todos los elementos
    if (Array.isArray(data)) {
      return await this.traduccionService.traducirRegistros(data, nombreTabla, idiomaId);
    } 
    // Si es un objeto único, traducir solo ese objeto
    else if (typeof data === 'object' && data.id) {
      return await this.traduccionService.traducirRegistro(data, nombreTabla, idiomaId);
    }
    
    // Para otros tipos de datos, devolver sin cambios
    return data;
  }

  /**
   * Detecta el nombre real de la tabla desde el contexto del repositorio/modelo
   * @param ctx - Contexto de invocación
   * @returns Nombre de la tabla o null si no se puede detectar
   */
  private async detectarTablaDesdeContexto(ctx: InvocationContext): Promise<string | null> {
    try {
      console.log('🔍 Detectando tabla desde contexto...');
      console.log('- Target:', ctx.target);
      console.log('- Target Name:', ctx.targetName);
      
      // Intentar obtener el repositorio desde el contexto del controlador
      const controllerInstance = ctx.target;
      
      if (controllerInstance && typeof controllerInstance === 'object') {
        // Buscar propiedades que terminen en 'Repository'
        for (const prop in controllerInstance) {
          if (prop.toLowerCase().includes('repository')) {
            const repository = (controllerInstance as any)[prop];
            console.log(`- Encontrado repositorio: ${prop}`, !!repository);
            
            if (repository && repository.entityClass) {
              console.log('- EntityClass:', repository.entityClass);
              console.log('- EntityClass.definition:', repository.entityClass.definition);
              
              // Obtener el modelo y sus settings desde definition
              const modelDefinition = repository.entityClass.definition;
              if (modelDefinition && modelDefinition.settings) {
                const modelSettings = modelDefinition.settings;
                console.log('- Model settings:', modelSettings);
                
                if (modelSettings.mysql && modelSettings.mysql.table) {
                  const tableName = modelSettings.mysql.table;
                  console.log('✅ Tabla encontrada desde modelo:', tableName);
                  return tableName;
                }
              }
            }
          }
        }
      }
      
      // Fallback: usar el método anterior si no se puede obtener desde el repositorio
      console.log('- 🔄 Usando fallback: detectar desde nombre del controlador');
      return this.traduccionService.detectarTabla(ctx.targetName);
      
    } catch (error) {
      console.error('❌ Error detectando tabla desde contexto:', error);
      // Fallback: usar el método anterior
      return this.traduccionService.detectarTabla(ctx.targetName);
    }
  }

  /**
   * Extrae el ID del idioma desde el contexto de la petición
   * @param ctx - Contexto de invocación
   * @returns ID del idioma o null si no se especifica
   */
  private getIdiomaFromContext(ctx: InvocationContext): number | null {
    try {
      console.log('🔍 Debug getIdiomaFromContext:');
      
      // Intentar diferentes formas de obtener el request
      let request: Request | undefined;
      
      // Método 1: Usando RestBindings.Http.REQUEST
      try {
        request = ctx.getSync<Request>(RestBindings.Http.REQUEST, { optional: true });
        console.log('- Método 1 (RestBindings.Http.REQUEST):', !!request);
      } catch (e) {
        console.log('- Método 1 falló:', e.message);
      }
      
      // Método 2: Usando el binding key directo
      if (!request) {
        try {
          request = ctx.getSync<Request>('rest.http.request', { optional: true });
          console.log('- Método 2 (rest.http.request):', !!request);
        } catch (e) {
          console.log('- Método 2 falló:', e.message);
        }
      }
      
      // Método 3: Intentar obtener desde parent context
      if (!request && ctx.parent) {
        try {
          request = ctx.parent.getSync<Request>(RestBindings.Http.REQUEST, { optional: true });
          console.log('- Método 3 (parent context):', !!request);
        } catch (e) {
          console.log('- Método 3 falló:', e.message);
        }
      }
      
      console.log('- Request final existe:', !!request);
      console.log('- Headers existen:', !!(request && request.headers));
      
      if (request && request.headers) {
        console.log('- Todos los headers:', JSON.stringify(request.headers, null, 2));
        const idiomaHeader = request.headers['x-idioma-id'] as string;
        console.log('- Header x-idioma-id:', idiomaHeader);
        
        if (idiomaHeader) {
          const idiomaId = parseInt(idiomaHeader, 10);
          console.log('- IdiomaId parseado:', idiomaId);
          
          // Verificar que sea un número válido
          if (!isNaN(idiomaId) && idiomaId > 0) {
            console.log('- ✅ IdiomaId válido:', idiomaId);
            return idiomaId;
          }
        }
      }

      console.log('- ❌ No se encontró idioma válido, devolviendo null');
      return null;

    } catch (error) {
      console.error('❌ Error al extraer idioma del contexto:', error);
      console.error('Stack:', error.stack);
      return null;
    }
  }
}