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
 * Interceptor para manejar escritura de traducciones
 * Redirige campos traducibles a traduccion_contenido cuando el idioma no es español
 */
export class EscrituraTraduccionInterceptor implements Provider<Interceptor> {
  constructor(
    @inject('services.TraduccionService')
    private traduccionService: TraduccionService,
  ) {}

  value() {
    return this.intercept.bind(this);
  }

  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    // console.log('📝 EscrituraTraduccionInterceptor - EJECUTÁNDOSE');
    // console.log('- Method:', invocationCtx.methodName);
    // console.log('- Target:', invocationCtx.targetName);

    try {
      // Verificar si es una operación de escritura
      const operacion = this.detectarOperacion(invocationCtx.methodName);
      
      if (!operacion) {
        //console.log('- No es operación de escritura, continuando...');
        return await next();
      }

      //console.log('- Operación detectada:', operacion);
      // Obtener idioma del contexto
      const idiomaId = this.getIdiomaFromContext(invocationCtx);
      
      if (!idiomaId || idiomaId === 1) {
        //console.log('- Idioma español o no especificado, guardado normal');
        return await next();
      }

      // Obtener el nombre de la tabla
      const nombreTabla = await this.detectarTablaDesdeContexto(invocationCtx);
      
      if (!nombreTabla) {
        // console.log('- No se pudo detectar tabla, guardado normal');
        return await next();
      }

      // console.log('- Procesando escritura para tabla:', nombreTabla, 'idioma:', idiomaId);

      // Procesar datos antes de guardar
      const datos = this.extraerDatos(invocationCtx);
      
      if (!datos) {
        // console.log('- No hay datos para procesar');
        return await next();
      }

      // Procesar los datos según el tipo de operación
      if (operacion === 'create') {
        return await this.procesarCreate(invocationCtx, next, datos, nombreTabla, idiomaId);
      } else if (operacion === 'update' || operacion === 'patch') {
        return await this.procesarUpdate(invocationCtx, next, datos, nombreTabla, idiomaId);
      }

      return await next();

    } catch (error) {
      console.error('❌ Error en EscrituraTraduccionInterceptor:', error);
      return await next();
    }
  }

  /**
   * Procesa operaciones CREATE
   */
  private async procesarCreate(
    ctx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
    datos: any,
    tabla: string,
    idiomaId: number
  ) {
    // Procesar datos antes de crear
    const datosOriginales = await this.traduccionService.procesarEscrituraTraduccion(
      datos,
      tabla,
      idiomaId,
      'create'
    );

    // Modificar los argumentos del contexto
    this.modificarArgumentos(ctx, datosOriginales);

    // Ejecutar la creación
    const resultado = await next();

    // Procesar traducciones pendientes si hay resultado con ID
    if (resultado && resultado.id && datosOriginales.__pendingTranslations) {
      await this.traduccionService.procesarTraduccionesPendientes(
        tabla,
        resultado.id,
        datosOriginales,
        idiomaId
      );
    }

    return resultado;
  }

  /**
   * Procesa operaciones UPDATE/PATCH
   */
  private async procesarUpdate(
    ctx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
    datos: any,
    tabla: string,
    idiomaId: number
  ) {
    // Obtener el ID del registro desde los argumentos
    const idRegistro = this.extraerIdRegistro(ctx);
    
    if (!idRegistro) {
      console.log('- No se pudo obtener ID del registro para UPDATE');
      return await next();
    }

    // Procesar datos antes de actualizar
    const datosOriginales = await this.traduccionService.procesarEscrituraTraduccion(
      datos,
      tabla,
      idiomaId,
      'update',
      idRegistro
    );

    // Modificar los argumentos del contexto
    this.modificarArgumentos(ctx, datosOriginales);

    // Ejecutar la actualización
    return await next();
  }

  /**
   * Detecta el tipo de operación basándose en el nombre del método
   */
  private detectarOperacion(methodName: string): 'create' | 'update' | 'patch' | null {
    const name = methodName.toLowerCase();
    
    if (name.includes('create')) return 'create';
    if (name.includes('update') || name.includes('replacebyid')) return 'update';
    if (name.includes('patch')) return 'patch';
    
    return null;
  }

  /**
   * Extrae los datos del cuerpo de la petición
   */
  private extraerDatos(ctx: InvocationContext): any {
    // Los datos suelen estar en el último argumento para operaciones de escritura
    const args = ctx.args;
    if (args && args.length > 0) {
      // Para CREATE, los datos suelen ser el primer argumento
      // Para UPDATE/PATCH, suelen ser el segundo (después del ID)
      const methodName = ctx.methodName.toLowerCase();
      
      if (methodName.includes('create')) {
        return args[0];
      } else if (methodName.includes('update') || methodName.includes('patch')) {
        return args[1]; // El segundo argumento después del ID
      }
    }
    
    return null;
  }

  /**
   * Extrae el ID del registro para operaciones UPDATE/PATCH
   */
  private extraerIdRegistro(ctx: InvocationContext): number | null {
    const args = ctx.args;
    if (args && args.length > 0) {
      // El ID suele ser el primer argumento en operaciones UPDATE/PATCH
      const id = args[0];
      return typeof id === 'number' ? id : parseInt(id, 10);
    }
    return null;
  }

  /**
   * Modifica los argumentos del contexto con los datos procesados
   */
  private modificarArgumentos(ctx: InvocationContext, datosModificados: any): void {
    const methodName = ctx.methodName.toLowerCase();
    
    if (methodName.includes('create')) {
      ctx.args[0] = datosModificados;
    } else if (methodName.includes('update') || methodName.includes('patch')) {
      ctx.args[1] = datosModificados;
    }
  }

  /**
   * Detecta tabla desde el contexto (reutiliza lógica del otro interceptor)
   */
  private async detectarTablaDesdeContexto(ctx: InvocationContext): Promise<string | null> {
    try {
      const controllerInstance = ctx.target;
      
      if (controllerInstance && typeof controllerInstance === 'object') {
        for (const prop in controllerInstance) {
          if (prop.toLowerCase().includes('repository')) {
            const repository = (controllerInstance as any)[prop];
            
            if (repository && repository.entityClass) {
              const modelDefinition = repository.entityClass.definition;
              if (modelDefinition && modelDefinition.settings) {
                const modelSettings = modelDefinition.settings;
                
                if (modelSettings.mysql && modelSettings.mysql.table) {
                  return modelSettings.mysql.table;
                }
              }
            }
          }
        }
      }
      
      // Fallback
      return this.traduccionService.detectarTabla(ctx.targetName);
      
    } catch (error) {
      console.error('Error detectando tabla:', error);
      return this.traduccionService.detectarTabla(ctx.targetName);
    }
  }

  /**
   * Extrae idioma del contexto (reutiliza lógica del otro interceptor)
   */
  private getIdiomaFromContext(ctx: InvocationContext): number | null {
    try {
      let request: Request | undefined;
      
      try {
        request = ctx.getSync<Request>(RestBindings.Http.REQUEST, { optional: true });
      } catch (e) {
        // Intentar con parent context
        if (ctx.parent) {
          try {
            request = ctx.parent.getSync<Request>(RestBindings.Http.REQUEST, { optional: true });
          } catch {}
        }
      }
      
      if (request && request.headers) {
        const idiomaHeader = request.headers['x-idioma-id'] as string;
        
        if (idiomaHeader) {
          const idiomaId = parseInt(idiomaHeader, 10);
          if (!isNaN(idiomaId) && idiomaId > 0) {
            return idiomaId;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error extrayendo idioma:', error);
      return null;
    }
  }
}