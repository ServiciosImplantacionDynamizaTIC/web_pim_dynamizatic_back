import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {juggler, repository} from '@loopback/repository';
import {get, response} from '@loopback/rest';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import {ConfiguracionLimpiezaLogsRepository, ParametroGlobalRepository, EmpresaRepository, UsuarioRepository} from '../repositories';
import nodemailer from 'nodemailer';
import {SecurityBindings, UserProfile} from '@loopback/security';


@authenticate('jwt')
export class LimpiaLogController {
  constructor(
    @inject('datasources.ApiBackend') private dataSource: juggler.DataSource,
    @repository(ConfiguracionLimpiezaLogsRepository)
    public configuracionLimpiezaLogsRepository: ConfiguracionLimpiezaLogsRepository,
    @repository(ParametroGlobalRepository)
    public parametroGlobalRepository: ParametroGlobalRepository,
    @repository(EmpresaRepository)
    public empresaRepository: EmpresaRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @inject(SecurityBindings.USER, {optional: true})
    public currentUser: UserProfile,
  ) { }


  // Función reutilizable para registrar logs
  async registrarLog(origen: string, mensaje: string) {
    const fechaHora = new Date().toISOString();
    try {
      await this.dataSource.execute(`
        INSERT INTO log_sincronizacion (origen, descripcion)
        VALUES (?, ?);
      `, [origen, `${mensaje}, con fecha ${fechaHora}`]);
    } catch (error) {
      console.error('Error al registrar el log:', error);
    }
  }

  // Función reutilizable para enviar emails
  async enviarEmail(asunto: string, cuerpo: string, tabla: string, errores: string[], empresaId: number) {
    let emails = ['acaicedo@dynamizatic.com', 'ajareno@dynamizatic.onmicrosoft.com'];
    
    try {
      const parametroEmails = await this.parametroGlobalRepository.findOne({where: {clave: 'correosEnvioLimpiezaLog'}});
      if (parametroEmails?.valor) emails = parametroEmails.valor.split(',').map(e => e.trim());
    } catch {}

    const rutaArchivo = './errores_limpieza_nuevo_PIM_logs.txt';
    try {
      // Validar que se proporcione empresaId
      if (!empresaId) {
        throw new Error('Se requiere empresaId para envío de correo');
      }

      // Obtener la empresa específica
      const fuenteDatosEmpresa = this.empresaRepository.dataSource;
      const query = `SELECT * FROM empresa WHERE id = ${empresaId} LIMIT 1;`;
      const empresaRegistro = await fuenteDatosEmpresa.execute(query);
      
      if (!empresaRegistro || empresaRegistro.length === 0) {
        throw new Error(`No se encontró la empresa con ID ${empresaId} para envío de correo`);
      }

      // Preparo la configuración para enviar el correo
      const transporter = nodemailer.createTransport({
        host: empresaRegistro[0]['servicio'],
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: empresaRegistro[0]['email'],
          pass: empresaRegistro[0]['password'],
        },
        tls: {rejectUnauthorized: false}
      });

      fs.writeFileSync(rutaArchivo, errores.join('\n'), 'utf8');

      await transporter.sendMail({
        from: empresaRegistro[0]['email'],
        to: emails.join(', '),
        subject: asunto,
        text: cuerpo,
        attachments: [{filename: 'errores_limpieza_nuevo_PIM_logs.txt', path: rutaArchivo, contentType: 'text/plain'}],
      });
      
      if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);

    } catch (error) {
      await this.registrarLog('EMAIL-LIMPIEZA', `Error al enviar correo: ${tabla}`);
      console.error('Error al enviar el correo:', error);
      if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
    }
  }

  // Exportar registros a CSV y comprimirlos en ZIP (solo si hay registros)
  private async exportarACSV(nombreTabla: string, empresaId: number, campoFecha: string, diasRetencion: number): Promise<string> {
    try {
      // Crear carpeta base si no existe
      const carpetaBase = './descargas/logs';
      if (!fs.existsSync(carpetaBase)) {
        fs.mkdirSync(carpetaBase, { recursive: true });
      }

      // Crear carpeta específica por empresa
      const nombreEmpresa = `empresa_${empresaId}`;
      const carpetaEmpresa = `${carpetaBase}/${nombreEmpresa}`;
      if (!fs.existsSync(carpetaEmpresa)) {
        fs.mkdirSync(carpetaEmpresa, { recursive: true });
      }

      // Nombres de archivos
      const fecha = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const nombreArchivoCSV = `empresa_${empresaId}_${nombreTabla}_${fecha}.csv`;
      const nombreArchivoZIP = `empresa_${empresaId}_${nombreTabla}_${fecha}.zip`;
      const rutaCSV = `${carpetaEmpresa}/${nombreArchivoCSV}`;
      const rutaZIP = `${carpetaEmpresa}/${nombreArchivoZIP}`;

      // Construir SELECT para obtener registros que se van a borrar
      const selectSQL = `SELECT * FROM ${nombreTabla} WHERE ${campoFecha} < DATE_SUB(NOW(), INTERVAL ${diasRetencion} DAY) AND empresaId = ${empresaId}`;

      // Ejecutar SELECT
      const registros = await this.dataSource.execute(selectSQL);

      if (!registros || registros.length === 0) {
        // Si no hay registros, no crear ningún archivo y retornar cadena vacía
        console.log(`No hay registros para exportar de ${nombreTabla} empresa ${empresaId}`);
        return '';
      }

      // Obtener nombres de columnas del primer registro
      const columnas = Object.keys(registros[0]);

      // Crear contenido CSV con separadores de punto y coma para compatibilidad con Excel
      const cabeceras = columnas.map(col => `"${col}"`).join(';');
      const filas = registros.map((reg: any) => 
        columnas.map(col => {
          const valor = reg[col];
          if (valor === null || valor === undefined) return '';
          if (typeof valor === 'string') return `"${valor.replace(/"/g, '""')}"`;
          return valor;
        }).join(';')
      );

      const contenidoCSV = [cabeceras, ...filas].join('\n');

      // Guardar archivo CSV temporal
      fs.writeFileSync(rutaCSV, contenidoCSV, 'utf8');

      // Crear archivo ZIP
      await this.crearZip(rutaCSV, rutaZIP, nombreArchivoCSV);

      // Eliminar archivo CSV temporal
      if (fs.existsSync(rutaCSV)) {
        fs.unlinkSync(rutaCSV);
      }

      return rutaZIP;
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : String(error);
      console.error(`Error exportando ${nombreTabla}:`, error);
      throw new Error(`Fallo al exportar CSV de ${nombreTabla}: ${mensajeError}`);
    }
  }

  // Función auxiliar para crear archivo ZIP
  private async crearZip(rutaCSV: string, rutaZIP: string, nombreArchivo: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(rutaZIP);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`ZIP creado: ${rutaZIP} (${archive.pointer()} bytes)`);
        resolve();
      });

      archive.on('error', (error: Error) => {
        reject(error);
      });

      archive.pipe(output);
      archive.file(rutaCSV, { name: nombreArchivo });
      archive.finalize();
    });
  }

  /* Programa CRON que borra registros de las tablas configuradas en configuracion_limpieza_logs
  según los días de retención especificados para cada tabla. */
  @authenticate.skip()
  @get('/limpiaLog')
  @response(200, {
    description:
      'Programa el cron diario que limpia las tablas configuradas en configuracion_limpieza_logs.',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async limpiaLog() {
    const cron = require('node-cron');

    // Patrón CRON
    // '0 0 2 * * *' = a las 02:00:00 de cada día
    cron.schedule(
      '0 0 2 * * *',
      async () => {
        try {
          await this.ejecutarLimpiezaLogs();
        } catch (error) {
          console.error('Error en limpieza de logs:', error);
        }
      },
      {scheduled: true, timezone: 'Europe/Madrid'},
    );

    return {ok: true, message: 'CRON de limpieza diaria programado'};
  }

  /**
   * Método que ejecuta la limpieza de logs según la configuración.
   *
   * Si se pasa empresaIdFiltro: limpia solo esa empresa
   * Si NO se pasa: limpia todas las empresas
   *
   * Para cada empresa:
   * 1. Borra registros más antiguos que los días de retención configurados
   * 2. Actualiza las fechas de ejecución y borrado
   * 3. Registra los resultados
  */
  private async ejecutarLimpiezaLogs(empresaIdFiltro?: number) {
    let configuraciones;

    if (empresaIdFiltro) {
      // Obtener configuraciones solo de una empresa específica
      configuraciones = await this.configuracionLimpiezaLogsRepository.find({
        where: {activo: 'S', empresaId: empresaIdFiltro},
      });
    } else {
      // Obtener todas las configuraciones con activo = 'S' y empresaId válido
      configuraciones = await this.configuracionLimpiezaLogsRepository.find({
        where: {activo: 'S'},
      });
      // Filtrar solo las que tienen empresaId definido
      configuraciones = configuraciones.filter(config => config.empresaId != null);
    }

    if (!configuraciones || configuraciones.length === 0) {
      return [];
    }

    const resultados = [];
    const errores: string[] = [];

    // Para cada configuración de limpieza: borrar los registros antiguos
    for (const config of configuraciones) {
      try {
        // Validar que la configuración tenga empresaId
        if (!config.empresaId) {
          throw new Error(`Configuración sin empresaId para tabla ${config.nombreTabla}`);
        }

        // Paso 1: Exportar a CSV ANTES de borrar
        const rutaGuardado = await this.exportarACSV(
          config.nombreTabla,
          config.empresaId,
          config.campoFechaTabla,
          config.numeroDiasRetencion,
        );

        // Paso 2: Crear la sentencia SQL para borrar registros antiguos
        // Usar EXACTAMENTE el mismo filtro que el SELECT del CSV
        const sentenciaSQL = `DELETE FROM ${config.nombreTabla}
          WHERE ${config.campoFechaTabla} < DATE_SUB(NOW(), INTERVAL ${config.numeroDiasRetencion} DAY)
          AND empresaId = ${config.empresaId}`;

        // Paso 3: Ejecutar el borrado y obtiene el número de filas afectadas
        const resultado = await this.dataSource.execute(sentenciaSQL);
        const registrosEliminados = resultado?.affectedRows || 0;

        // Actualiza fechas en la configuración
        // Siempre actualiza fechaUltimaEjecucion
        // Solo actualiza fechaUltimoBorrado si realmente se borraron registros
        const actualizacion: any = {
          fechaUltimaEjecucion: new Date().toISOString(),
        };

        if (registrosEliminados > 0) {
          actualizacion.fechaUltimoBorrado = new Date().toISOString();
        }

        await this.configuracionLimpiezaLogsRepository.updateById(config.id!, actualizacion);

        // Guarda resultado exitoso
        resultados.push({
          empresa: config.empresaId,
          tabla: config.nombreTabla,
          registrosEliminados, // Número de filas borradas
          ok: true,
        });

      } catch (error) {
        const mensajeError = error instanceof Error ? error.message : String(error);
        console.error(`Error al limpiar tabla ${config.nombreTabla} (empresa ${config.empresaId}):`, error);

        // Si falla, actualiza solo la fecha de ejecución (no la de borrado exitoso)
        try {
          await this.configuracionLimpiezaLogsRepository.updateById(config.id!, {
            fechaUltimaEjecucion: new Date().toISOString(),
          });
        } catch (updateErr) {
          console.error(`Error al actualizar configuración:`, updateErr);
        }

        // Guardar resultado con error
        resultados.push({
          empresa: config.empresaId,
          tabla: config.nombreTabla,
          error: mensajeError,
          ok: false,
        });

        // Enviar email de error específico para esta empresa
        const asuntoError = `Error en limpieza de logs - Empresa ${config.empresaId}`;
        const cuerpoError = `Error al limpiar la tabla ${config.nombreTabla} de la empresa ${config.empresaId}.`;
        const errorEspecifico = [`Empresa ${config.empresaId} - Error al limpiar tabla ${config.nombreTabla}: ${mensajeError}`];
        
        try {
          await this.enviarEmail(asuntoError, cuerpoError, config.nombreTabla, errorEspecifico, config.empresaId);
        } catch (emailError) {
          console.error('Error al enviar email de notificación:', emailError);
        }
      }
    }

    return resultados;
  }

  /**
   * Limpieza de logs manual - ejecuta el mismo proceso que el CRON.
   * Recorre TODAS las empresas y sus configuraciones.
   */
  @get('/limpiaLogManual')
  @response(200, {
    description:
      'Ejecuta ahora mismo la limpieza de logs configurados para todas las empresas.',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async limpiaLogManual() {
    try {
      // Obtener todas las empresas
      const fuenteDatosEmpresa = this.empresaRepository.dataSource;
      const empresas = await fuenteDatosEmpresa.execute(`SELECT id FROM empresa`);
      
      if (!empresas || empresas.length === 0) {
        return {
          ok: true,
          message: 'No hay empresas para limpiar',
          resultados: [],
        };
      }

      const resultadosTotales = [];

      // Recorrer cada empresa y ejecutar limpieza
      for (const empresa of empresas) {
        const resultados = await this.ejecutarLimpiezaLogs(empresa.id);
        if (resultados && resultados.length > 0) {
          resultadosTotales.push(...resultados);
        }
      }

      return {
        ok: true,
        message: 'Limpieza ejecutada correctamente para todas las empresas',
        resultados: resultadosTotales,
      };
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        message: 'Error al ejecutar la limpieza',
        error: mensajeError,
      };
    }
  }
}
