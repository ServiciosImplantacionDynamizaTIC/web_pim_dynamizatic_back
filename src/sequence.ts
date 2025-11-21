// import {MiddlewareSequence} from '@loopback/rest';
// export class MySequence extends MiddlewareSequence {}

import { AuthenticateFn, AuthenticationBindings, AUTHENTICATION_STRATEGY_NOT_FOUND, USER_PROFILE_NOT_FOUND } from '@loopback/authentication';
import { inject } from '@loopback/context';
import { FindRoute, InvokeMethod, InvokeMiddleware, ParseParams, Reject, Request, RequestContext, ResolvedRoute, Response, Send, SequenceActions, SequenceHandler } from '@loopback/rest';
import {LogAccionRepository, EmpresaRepository, UsuarioRepository} from './repositories';
import {repository} from '@loopback/repository';
import {securityId} from '@loopback/security';
import {JWTService} from './services/jwt-services';
import {TokenServiceBindings} from './keys';

export class MySequence implements SequenceHandler {
    @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true })
    protected invokeMiddleware: InvokeMiddleware = () => false;

    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject,
        @inject(AuthenticationBindings.AUTH_ACTION)
        protected authenticateRequest: AuthenticateFn,
        @repository(LogAccionRepository) protected logAccionRepository?: LogAccionRepository,
        @repository(UsuarioRepository) protected usuarioRepository?: UsuarioRepository,
        @repository(EmpresaRepository) protected empresaRepository?: EmpresaRepository,
        @inject(TokenServiceBindings.TOKEN_SERVICE, {optional: true})
        protected jwtService?: JWTService,
    ) { }

    // Dentro de esta función pasan TODAS las peticiones de la API
    async handle(context: RequestContext) {
        const {request, response} = context;
        const tiempoInicioMilisegundos = Date.now();
        let informacionRuta: ResolvedRoute | undefined;
        let resultadoControlador: any;
        let errorCapturado: any;
        let idDelUsuarioAutenticado: number | undefined;

        try {
            const middlewareYaFinalizo = await this.invokeMiddleware(context);
            if (middlewareYaFinalizo) return;
            informacionRuta = this.findRoute(request);

            // Autenticación y extracción del ID de usuario
            const perfilUsuario = await this.authenticateRequest(request);
            
            // Extraemos el ID desde el perfil autenticado o desde el token JWT directamente
            if (perfilUsuario) {
                // Caso 1: Endpoint con @authenticate - usamos el perfil devuelto
                const idUsuario = perfilUsuario[securityId] || perfilUsuario.id;
                idDelUsuarioAutenticado = idUsuario ? Number(idUsuario) : undefined;
            } else {
                // Caso 2: Endpoint sin @authenticate - decodificamos el token manualmente si existe
                try {
                    const tokenBearer = request.headers.authorization?.split(' ')[1];
                    if (tokenBearer && this.jwtService) {
                        const tokenDecodificado: any = await this.jwtService.verifyToken(tokenBearer);
                        idDelUsuarioAutenticado = tokenDecodificado?.id ? Number(tokenDecodificado.id) : undefined;
                    }
                } catch (_) { /* Token inválido o ausente */ }
            }

            // Preparamos los datos que necesita la operación y la ejecutamos
            const argumentosDelControlador = await this.parseParams(request, informacionRuta);
            resultadoControlador = await this.invoke(informacionRuta, argumentosDelControlador);

            // Enviamos la respuesta al usuario inmediatamente (sin esperar a guardar el registro)
            this.send(response, resultadoControlador);
        } catch (errorDePeticion: any) {
            // Si algo salió mal, guardamos el error para registrarlo después
            errorCapturado = errorDePeticion;
            resultadoControlador = errorDePeticion;
            
            if (errorDePeticion.code === AUTHENTICATION_STRATEGY_NOT_FOUND || errorDePeticion.code === USER_PROFILE_NOT_FOUND) {
                Object.assign(errorDePeticion, { statusCode: 401 /* No autorizado */ })
            }
            
            // Informamos al usuario que hubo un problema (mostramos mensaje de error)
            this.reject(context, errorDePeticion);
        } finally {
            const tiempoFinMilisegundos = Date.now();

            // Guardamos información de la solicitud en segundo plano (sin hacer esperar al usuario)
            // Esto se ejecuta SIEMPRE, tanto si todo fue bien como si hubo algún problema
            (async () => {
                try {
                    // Determinamos si debemos omitir el registro de esta petición
                    // Registramos llamadas a controladores junto con las peticiones HTTP
                    // que hace el navegador para descargar/obtener archivos de imagen.
                    // Estas peticiones se podrían filtrar pero por el momento las mantenemos
                    const peticionComoObjeto = request as Request;
                    const rutaCompletaDeLaPeticion = peticionComoObjeto.originalUrl || `${peticionComoObjeto.baseUrl || ''}${peticionComoObjeto.path || ''}`;

                    // NO registramos peticiones OPTIONS, raíz /, explorer, y openapi.json
                    const metodoHttp = request.method?.toUpperCase();
                    if (metodoHttp === 'OPTIONS' || rutaCompletaDeLaPeticion === '/' || rutaCompletaDeLaPeticion.startsWith('/explorer') || rutaCompletaDeLaPeticion.includes('openapi.json')) {
                        return;
                    }

                    // Paso 1: El ID del usuario ya fue capturado después de la autenticación (variable idDelUsuarioAutenticado)

                    // Paso 2: Construimos la dirección web completa
                    // Ejemplo: http://localhost:5000/clientes?filtro=activos
                    const nombreHostServidor = (peticionComoObjeto.get && peticionComoObjeto.get('host')) || peticionComoObjeto.headers?.host || '';
                    const protocoloHttp = peticionComoObjeto.protocol || (peticionComoObjeto.secure ? 'https' : 'http');
                    const urlCompletaDeLaPeticion = `${protocoloHttp}://${nombreHostServidor}${rutaCompletaDeLaPeticion}`;

                    // Paso 3: Buscamos a qué empresa pertenece el usuario que hizo la solicitud
                    let nombreDeLaEmpresa: string | undefined;
                    let idDeLaEmpresaDelUsuario: number | undefined;
                    try {
                        if (idDelUsuarioAutenticado && this.usuarioRepository) {
                            // Primero buscamos los datos del usuario en la base de datos
                            const datosDelUsuario: any = await this.usuarioRepository.findById(idDelUsuarioAutenticado).catch(() => undefined);
                            idDeLaEmpresaDelUsuario = datosDelUsuario?.empresaId;
                            if (idDeLaEmpresaDelUsuario && this.empresaRepository) {
                                // Luego buscamos el nombre de la empresa usando el ID que tenía el usuario
                                const datosDelaEmpresa: any = await this.empresaRepository.findById(idDeLaEmpresaDelUsuario).catch(() => undefined);
                                if (datosDelaEmpresa && datosDelaEmpresa.nombre) nombreDeLaEmpresa = datosDelaEmpresa.nombre;
                            }
                        }
                    } catch (ignorarErrorObtencionEmpresa) {
                        // Si no podemos obtener el nombre de la empresa, lo dejamos vacío
                        nombreDeLaEmpresa = undefined;
                        idDeLaEmpresaDelUsuario = undefined;
                    }

                    // Paso 4: Identificamos qué parte del sistema se ejecutó (controlador y función específica)
                    let nombreDelControlador: string | undefined;
                    let nombreDeLaFuncion: string | undefined;
                    try {
                        // Verificamos si la ruta tiene una extensión de archivo (es un archivo estático)
                        // ya que se estaban insertando nombres de archivos como controladores y funciones
                        const tieneExtensionDeArchivo = /\.[a-z0-9]{2,4}$/i.test(rutaCompletaDeLaPeticion);

                        if (tieneExtensionDeArchivo) {
                            // Si es un archivo estático(imagen o documento), no hay que extraer controlador ni función
                            nombreDelControlador = undefined;
                            nombreDeLaFuncion = undefined;
                        } else {
                            // Buscamos la información técnica de la ruta que contiene los nombres
                            const especificacionOpenApiDeLaRuta = informacionRuta?.spec as Record<string, any> | undefined;
                            const nombreCompletoConControladorYFuncion: string | undefined = especificacionOpenApiDeLaRuta?.operationId || especificacionOpenApiDeLaRuta?.['x-operation-name'] || informacionRuta?.describe?.() || undefined;
                            nombreDelControlador = (especificacionOpenApiDeLaRuta?.tags && especificacionOpenApiDeLaRuta.tags[0]) || especificacionOpenApiDeLaRuta?.['x-controller-name'] || undefined;

                            // Limpiamos el nombre de la función para que solo aparezca el nombre corto (sin prefijos innecesarios)
                            if (nombreCompletoConControladorYFuncion) {
                                // Quitamos cosas como "ClientesController.obtenerTodos" para dejar solo "obtenerTodos"
                                let nombreDeLaFuncionSinPrefijoDeControlador = nombreCompletoConControladorYFuncion.toString();
                                // Eliminamos cualquier prefijo que tenga la palabra "Controller" seguida de puntos o símbolos
                                nombreDeLaFuncionSinPrefijoDeControlador = nombreDeLaFuncionSinPrefijoDeControlador.replace(/.*Controller[.:#\/]+/, '');
                                // Si todavía queda el nombre del controlador al inicio, lo quitamos también
                                if (nombreDelControlador) {
                                    const nombreDelControladorSinSufijoController = nombreDelControlador.toString().replace(/Controller$/i, '');
                                    if (nombreDeLaFuncionSinPrefijoDeControlador.startsWith(nombreDelControladorSinSufijoController + '.')) {
                                        nombreDeLaFuncionSinPrefijoDeControlador = nombreDeLaFuncionSinPrefijoDeControlador.slice(nombreDelControladorSinSufijoController.length + 1);
                                    }
                                    if (nombreDeLaFuncionSinPrefijoDeControlador.startsWith(nombreDelControlador + '.')) {
                                        nombreDeLaFuncionSinPrefijoDeControlador = nombreDeLaFuncionSinPrefijoDeControlador.slice(nombreDelControlador.length + 1);
                                    }
                                }
                                // Dividimos por símbolos como punto, dos puntos, almohadilla o barra y nos quedamos con la última parte
                                const segmentosSeparadosDelNombreDeLaFuncion = nombreDeLaFuncionSinPrefijoDeControlador.split(/[.:#\/]/).filter(Boolean);
                                nombreDeLaFuncion = segmentosSeparadosDelNombreDeLaFuncion.length ? segmentosSeparadosDelNombreDeLaFuncion[segmentosSeparadosDelNombreDeLaFuncion.length - 1] : nombreDeLaFuncionSinPrefijoDeControlador;
                            } else {
                                nombreDeLaFuncion = undefined;
                            }
                        }
                    } catch (ignorarErrorExtraccionNombres) {
                        // Si no podemos extraer los nombres, los dejamos vacíos
                        nombreDelControlador = undefined;
                        nombreDeLaFuncion = undefined;
                    }

                    // Convertimos cadenas vacías a undefined para que sean NULL en la base de datos
                    // ya que no aportan informacion y se esta insertando contenido no controlado
                    if (nombreDelControlador && !nombreDelControlador.trim()) nombreDelControlador = undefined;
                    if (nombreDeLaFuncion && !nombreDeLaFuncion.trim()) nombreDeLaFuncion = undefined;
                    // También convertimos literalmente comillas dobles solas
                    if (nombreDelControlador === '""' || nombreDelControlador === '"') nombreDelControlador = undefined;
                    if (nombreDeLaFuncion === '""' || nombreDeLaFuncion === '"') nombreDeLaFuncion = undefined;

                    // Paso 5: Preparamos el código de estado para guardarlo
                    // El código de estado indica si todo fue bien (200) o hubo un error (404, 500, etc.)
                    const codigoEstadoHttp = (response as Response)?.statusCode ?? (errorCapturado?.statusCode ?? (errorCapturado ? 500 : 200));
                    const textoJsonDelResultado = JSON.stringify({ status: codigoEstadoHttp });

                    // Calculamos cuánto tiempo tardó en procesarse la solicitud (en segundos)
                    const duracionDeLaPeticionEnSegundos = (tiempoFinMilisegundos - tiempoInicioMilisegundos) / 1000;

                    // Paso 6: Guardamos toda la información recopilada en la tabla de registros de la base de datos
                    if (this.logAccionRepository) {
                        await this.logAccionRepository.create({
                            controller: nombreDelControlador,
                            funcion: nombreDeLaFuncion,
                            endPoint: informacionRuta?.path,
                            tipo: request.method?.toUpperCase(),
                            url: urlCompletaDeLaPeticion,
                            fechaInicio: new Date(tiempoInicioMilisegundos).toISOString(),
                            fechaFin: new Date(tiempoFinMilisegundos).toISOString(),
                            segundos: duracionDeLaPeticionEnSegundos,
                            resultado: textoJsonDelResultado,
                            empresaId: idDeLaEmpresaDelUsuario,
                            nombreEmpresa: nombreDeLaEmpresa,
                            usuarioId: idDelUsuarioAutenticado,
                        });
                    }
                } catch (errorEnProcesoDeLogging) {
                    // Si algo falla al guardar el registro, NO afectamos la respuesta que ya se envió al usuario
                    // Solo mostramos el error en la consola
                    try {
                        console.error('Error al crear registro en tabla log_accion:', errorEnProcesoDeLogging);
                    } catch (ignorarErrorDeConsola) {
                        // Si ni siquiera podemos mostrar en consola, simplemente lo ignoramos
                    }
                }
            })();
        }
    }
}
