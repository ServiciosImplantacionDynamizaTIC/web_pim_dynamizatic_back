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
import { inject } from '@loopback/core';
import { Usuario, UsuarioCredenciales } from '../models';
import { Credentials, EmpresaRepository, PlantillaEmailRepository, UsuarioCredencialesRepository, UsuarioRepository, UsuarioRestablecerPasswordRepository } from '../repositories';
import { FileUploadController } from './FileUpload.controller';
import { UserRegisterData } from './specs/user-controller.specs';
import { validateCredentials } from '../services/validator';
import { PasswordHasherBindings, TokenServiceBindings, RefreshTokenServiceBindings, UserServiceBindings } from '../keys';
import { PasswordHasher } from '../services/hash.password.bcryptjs';
import _ from 'lodash';
import { AuthLoginObject, TokenObject } from '../types';
import { RefrescarTokenService } from '../services/refresh-token.service';
import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import path from 'path';
import nodemailer from 'nodemailer';

export class UsuariosController {
  [x: string]: any;
  constructor(
    @repository(PlantillaEmailRepository)
    public plantillaEmailRepository: PlantillaEmailRepository,
    @repository(EmpresaRepository)
    public empresaRepository: EmpresaRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @inject('controllers.FileUploadController')
    public fileUploadController: FileUploadController,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<Usuario, Credentials>,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @repository(UsuarioCredencialesRepository)
    public usuarioCredencialesRepository: UsuarioCredencialesRepository,
    @inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
    public refreshService: RefrescarTokenService,
    @repository(UsuarioRestablecerPasswordRepository)
    public usuarioRestablecerPasswordRepository: UsuarioRestablecerPasswordRepository,
  ) { }

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Usuario) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    return this.usuarioRepository.create(usuario);
  }

  @post('/usuarios/login')
  @response(200, {
    description: 'Login de usuario con JWT',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            expiresIn: { type: 'string' },
            refreshToken: { type: 'string' },
            userData: getModelSchemaRef(Usuario),
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      description: 'Funcion de Login',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['mail', 'password'],
            properties: {
              mail: {
                type: 'string'
              },
              password: {
                type: 'string',
              },
            },
          }
        }
      }
    }) credentials: Credentials,
  ): Promise<AuthLoginObject> {
    try {
      const user = await this.userService.verifyCredentials(credentials);
      const userProfile = await this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      const tokens = await this.refreshService.generateToken(
        userProfile,
        token,
      );

      // return {user, token}
      return {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn ?? undefined,
        refreshToken: tokens.refreshToken ?? undefined,
        userData: user
      };
    }
    catch (error) {
      return error
    }

  }

  @post('/usuarios/register')
  @response(200, {
    description: 'User modelo instancia',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object'
            },
            token: {
              type: 'string',
            }
          },
        }
      }
    },
  })
  async register(
    @requestBody({
      description: 'registro del perfil de usuario',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'mail',
              'password',
              'nombre',
              'empresa_id',
              'rol_id'
            ],
            properties: {
              nombre: {
                type: 'string'
              },
              mail: {
                type: 'string'
              },
              password: {
                type: 'string',
              },
              empresaId: {
                type: 'number',
              },
              rolId: {
                type: 'number',
              }
            },
          }
        }
      }
    })
    userData: UserRegisterData,
  ): Promise<Usuario> {
    const user = _.pick(userData, ['nombre', 'mail', 'password', 'empresaId', 'rolId']);
    validateCredentials(user);
    const newUser = {
      nombre: userData.nombre,
      mail: userData.mail,
      empresaId: 1,
      rolId: 1
    };
    const password = await this.passwordHasher.hashPassword(userData.password);
    const foundUser = await this.usuarioRepository.findOne({
      where: { mail: user.mail }
    });
    if (foundUser) {
      throw new HttpErrors.UnprocessableEntity(`Ya existe una cuenta de usuario vinculada a este mail: ${user.mail}`)
    }
    const saveUser = await this.usuarioRepository.create(newUser);
    await this.usuarioRepository.userCredentials(saveUser.id).create({ password });
    return saveUser;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    const dataSource = this.usuarioRepository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += ` WHERE 1=1`
    if (where) {
      for (const [key] of Object.entries(where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((where as any)[key])) {
              if (subValue !== '' && subValue != null) {
                if (!first) {
                  if (key === 'and') {
                    filtros += ` AND`;
                  }
                  else {
                    filtros += ` OR`;
                  }
                }
                else {
                  filtros += ' AND ('
                }
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  filtros += ` ${subKey} = ${subValue}`;
                }
                else {
                  filtros += ` ${subKey} LIKE '%${subValue}%'`;
                }
                first = false
              }
            }
            if (!first) {
              filtros += `)`;
            }
          }
        }

      }
    }
    const query = `SELECT COUNT(*) AS count FROM vista_usuario_rol_idioma${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros[0];
  }

  @authenticate('jwt')
  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    const dataSource = this.usuarioRepository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += ` WHERE 1=1`
    if (filter?.where) {
      for (const [key] of Object.entries(filter?.where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((filter?.where as any)[key])) {
              if (subValue !== '' && subValue != null) {
                if (!first) {
                  if (key === 'and') {
                    filtros += ` AND`;
                  }
                  else {
                    filtros += ` OR`;
                  }
                }
                else {
                  filtros += ' AND ('
                }
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  filtros += ` ${subKey} = ${subValue}`;
                }
                else {
                  filtros += ` ${subKey} LIKE '%${subValue}%'`;
                }
                first = false
              }
            }
            if (!first) {
              filtros += `)`;
            }
          }
        }

      }
    }
    // Agregar ordenamiento
    if (filter?.order) {
      filtros += ` ORDER BY ${filter.order}`;
    }
    // Agregar paginación
    if (filter?.limit) {
      filtros += ` LIMIT ${filter?.limit}`;
    }
    if (filter?.offset) {
      filtros += ` OFFSET ${filter?.offset}`;
    }
    const query = `SELECT * FROM vista_usuario_rol_idioma${filtros}`;
    const registros = await dataSource.execute(query);
    return registros;
  }

  @post('/usuarios/recuperarPassword')
  async recuperarPassword(
    @requestBody({
      description: 'Correo electrónico para restablecer contraseña',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string' },
            },
          },
        },
      },
    })
    body: { email: string },
  ): Promise<{ status: string; message: string }> {
    try {
      const { email } = body;

      // Generamos el código de restablecimiento
      const codigoRecuperacion = Math.floor(100000 + Math.random() * 900000).toString();
      const expiraEn = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas desde ahora

      //Comprueba si el email existe
      const dataSource = this.usuarioRestablecerPasswordRepository.dataSource;
      let query = `SELECT * FROM usuario WHERE mail = '${email}'`;
      const registros = await dataSource.execute(query);

      if (registros.length === 0) {
        return { status: 'ERROR', message: 'No se encontró un usuario con el correo proporcionado.' };
      }

      // Limpiamos los códigos de recuperacion anteriores de la BD
      query = `DELETE FROM usuario_restablecer_password WHERE email = '${email}'`;
      await dataSource.execute(query);

      // Guardamos el código de recuperación en la BD
      await this.usuarioRestablecerPasswordRepository.create({
        email,
        usuarioId: registros[0].id,
        codigoRecuperacion: codigoRecuperacion,
        expiraEn: expiraEn.toISOString(),
      });

      const nombrePlantilla = 'RecuperarContraseña'; // Nombre de la plantilla de correo a utilizar

      // Obtengo la plantilla del correo
      const dataSourcePlantillaEmail = this.plantillaEmailRepository.dataSource;
      query = `SELECT * FROM plantilla_email WHERE nombrePlantilla="${nombrePlantilla}";`;
      const plantillaRegistro = await dataSourcePlantillaEmail.execute(query);

      if (plantillaRegistro.length === 0) {
        return { status: 'ERROR', message: 'No se encontró la plantilla de correo.' };
      }

      let htmlContent = plantillaRegistro[0]['cuerpo'] ? plantillaRegistro[0]['cuerpo'].toString('utf8') : '';

      //Obtengo la empresa
      const dataSourceEmpresa = this.empresaRepository.dataSource;
      query = `SELECT * FROM empresa WHERE id=${plantillaRegistro[0]['empresaId']};`;
      const empresaRegistro = await dataSourceEmpresa.execute(query);

      if (empresaRegistro.length === 0) {
        return { status: 'ERROR', message: 'No se encontró la configuración de la empresa.' };
      }

      // Verifico que existan las credenciales de correo
      if (!empresaRegistro[0]['email'] || empresaRegistro[0]['email'].length === 0 ||
        !empresaRegistro[0]['password'] || empresaRegistro[0]['password'].length === 0) {
        return { status: 'ERROR', message: 'No se encontró configuración válida de correo.' };
      }

      // Preparo la configuración para enviar el correo
      const transporter = nodemailer.createTransport({
        host: empresaRegistro[0]['servicio'],// Servidor SMTP de Outlook
        port: 587,                 // Puerto estándar para conexiones seguras con STARTTLS
        secure: false,             // false para STARTTLS
        requireTLS: true,
        auth: {
          user: empresaRegistro[0]['email'], // Dirección de correo de Outlook
          pass: empresaRegistro[0]['password'], // Contraseña
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Obtengo Unicamente los archivos de la seccion de "Correo plantilla" relacionados con la plantilla de email "RecuperarContraseña"
      const dataSourceArchivo = this.plantillaEmailRepository.dataSource;
      query = `SELECT a.* FROM archivo a INNER JOIN tipo_archivo ta ON a.tipoArchivoId = ta.id INNER JOIN seccion s ON ta.seccionId = s.id WHERE s.nombre = 'Correo plantilla' AND a.tabla = 'correo plantilla' AND a.idTabla = ${plantillaRegistro[0]['id']} AND a.empresaId = ${plantillaRegistro[0]['empresaId']};`;
      const archivos = await dataSourceArchivo.execute(query);
      
      // Incluyo las imágenes insertadas en la plantilla
      const base64Images = htmlContent.match(/src="data:image\/[^;]+;base64[^"]+"/g) || [];
      const attachments = base64Images.map((img: { match: (arg0: RegExp) => any[]; }, index: any) => {
        const base64Data = img.match(/base64,([^"]+)/)[1];
        const cid = `image${index}@nodemailer.com`;
        htmlContent = htmlContent.replace(img, `src="cid:${cid}"`);
        return {
          filename: `image${index}.png`,
          content: base64Data,
          encoding: 'base64',
          cid: cid
        };
      });

      // Encapsula el string de htmlContent dentro de las etiquetas html <html> y <body> para que servicios de correo acepten el contenido
      htmlContent = `<html><body>${htmlContent}</body></html>`;

      // Reemplaza el marcador de posición {{codigoRecuperacion}} con el código de recuperación real
      htmlContent = htmlContent.replace('{{codigoRecuperacion}}', codigoRecuperacion);

      const publicPath = path.resolve(__dirname, '../../public');
      // Incluyo los archivos adjuntados de la plantilla
      for (let i = 0; i < archivos.length; i++) {
        attachments.push({
          filename: archivos[i]['url'].split('/').pop(),
          path: path.join(publicPath, `/${archivos[i]['url']}`)
        })
      }

      // Opciones del email
      const parametrosMail = {
        from: empresaRegistro[0]['email'],
        to: email,
        subject: plantillaRegistro[0]['titulo'],
        html: htmlContent,
        attachments: attachments
      };

      // Enviamos el email como promesa para que espere la respuesta, y responda si ha sido enviado correctamente o no.
      try {
        await transporter.sendMail(parametrosMail);
        return { status: 'OK', message: 'Correo enviado con éxito.' };
      } catch (emailError) {
        console.error('Error al enviar el email:', emailError);
        return { status: 'ERROR', message: 'No se pudo enviar el correo. Por favor, intenta nuevamente.' };
      }

    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return { status: 'ERROR', message: 'No se pudo enviar el correo. Por favor, intenta nuevamente.' };
    }
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, { partial: true }),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Usuario, { exclude: 'where' }) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @get('/usuarios/validarCodigoRecuperacion/{codigoRecuperacion}')
  @response(200, {
    description: 'Código de recuperación validado',
    content: {
      'application/json': {
        schema: {
          type: 'number',
        }
      },
    },
  })
  async validarCodigoRecuperacion(
    @param.path.number('codigoRecuperacion') codigoRecuperacion: number,
  ): Promise<Number> {
    const dataSource = this.usuarioRestablecerPasswordRepository.dataSource;
    let query = `SELECT usuarioId FROM usuario_restablecer_password WHERE codigoRecuperacion = '${codigoRecuperacion}'`;
    const registros = await dataSource.execute(query);
    //Si existe el registro, devolvemos el id del usuario
    if (registros.length > 0) {
      return registros[0]['usuarioId'];
    }
    return -1;
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, { partial: true }),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    try {
      const dataSource = this.usuarioRepository.dataSource;

      // Eliminamos los registros relacionados
      let query = `DELETE FROM usuario_restablecer_password WHERE usuarioId = ${id}`;
      await dataSource.execute(query);

      query = `DELETE FROM usuario_credenciales WHERE usuarioId = ${id}`;
      await dataSource.execute(query);

      // Finalmente eliminamos el usuario
      await this.usuarioRepository.deleteById(id);
    } catch (e) {
      if (e.errno === 1451) {
        throw new HttpErrors.BadRequest('No se pudo eliminar el registro porque tiene otros registros relacionados.');
      } else {
        throw new HttpErrors.BadRequest('No se pudo eliminar el registro.');
      }
    }
  }

  @get('/vistaEmpresaRolUsuario')
  @response(200, {
    description: 'Devuelve usuarios y su rol con la empresa',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async vistaEmpresaRolUsuario(@param.filter(Usuario) filter?: Filter<Object>,): Promise<Object[]> {
    const dataSource = this.usuarioRepository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += ` WHERE 1=1`
    if (filter?.where) {
      for (const [key] of Object.entries(filter?.where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((filter?.where as any)[key])) {
              if (subValue !== '' && subValue != null) {
                if (!first) {
                  if (key === 'and') {
                    filtros += ` AND`;
                  }
                  else {
                    filtros += ` OR`;
                  }
                }
                else {
                  filtros += ' AND ('
                }
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  filtros += ` ${subKey} = ${subValue}`;
                }
                else {
                  filtros += ` ${subKey} LIKE '%${subValue}%'`;
                }
                first = false
              }
            }
            if (!first) {
              filtros += `)`;
            }
          }
        }

      }
    }
    // Agregar ordenamiento
    if (filter?.order) {
      filtros += ` ORDER BY ${filter.order}`;
    }
    // Agregar paginación
    if (filter?.limit) {
      filtros += ` LIMIT ${filter?.limit}`;
    }
    if (filter?.offset) {
      filtros += ` OFFSET ${filter?.offset}`;
    }
    const query = `SELECT * FROM vista_empresa_rol_usuario${filtros}`;
    const registros = await dataSource.execute(query);
    return registros;
  };

  @get('/obtenerUsuarioAvatar/{id}')
  @response(200, {
    description: 'Devuelve avatar del usuario',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async obtenerUsuarioAvatar(@param.path.number('id') id: number,): Promise<Object[]> {

    const dataSource = this.usuarioRepository.dataSource;
    const query = `SELECT url FROM archivo WHERE tabla = 'usuario' AND idTabla = ${id}`;
    const registros = await dataSource.execute(query);
    return registros;
  };

  @get('/vistaEmpresaRolUsuarioCount')
  @response(200, {
    description: 'Devuelve usuarios y su rol con la empresa',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async vistaEmpresaRolUsuarioCount(@param.where(Usuario) where?: Where<Usuario>,): Promise<Usuario[]> {
    const dataSource = this.usuarioRepository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += ` WHERE 1=1`
    if (where) {
      for (const [key] of Object.entries(where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((where as any)[key])) {
              if (subValue !== '' && subValue != null) {
                if (!first) {
                  if (key === 'and') {
                    filtros += ` AND`;
                  }
                  else {
                    filtros += ` OR`;
                  }
                }
                else {
                  filtros += ' AND ('
                }
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  filtros += ` ${subKey} = ${subValue}`;
                }
                else {
                  filtros += ` ${subKey} LIKE '%${subValue}%'`;
                }
                first = false
              }
            }
            if (!first) {
              filtros += `)`;
            }
          }
        }

      }
    }
    const query = `SELECT COUNT(*) AS count FROM vista_empresa_rol_usuario${filtros}`;
    const registros = await dataSource.execute(query, []);
    return registros;
  }

  @patch('/usuarioCredenciales/{idUsuario}')
  @response(204, {
    description: 'UsuarioCredenciales PATCH success',
  })
  async updateByIdCredenciales(
    @param.path.number('idUsuario') idUsuario: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCredenciales, { partial: true }),
        },
      },
    })
    usuarioCredenciales: UsuarioCredenciales,
  ): Promise<{ status: string; message: string }> {
    if (usuarioCredenciales.password) {

      //Comprueba si la contraseña del usuario existe en la base de datos
      const dataSource = this.usuarioCredencialesRepository.dataSource;
      let query = `SELECT * FROM usuario_credenciales WHERE usuarioId = '${idUsuario}'`;
      const registros = await dataSource.execute(query);

      //Si no existe, la crea
      if (registros.length === 0) {
        query = `INSERT INTO usuario_credenciales (password, usuarioId) VALUES ('${usuarioCredenciales.password}', ${idUsuario})`;
        await dataSource.execute(query);
      } else {
        //Si existe, la actualiza
        query = `UPDATE usuario_credenciales SET password='${usuarioCredenciales.password}' WHERE usuarioId=${idUsuario}`;
        await dataSource.execute(query);
      }

      return { status: 'OK', message: 'Contraseña editada con exito.' };
    }
    return { status: 'ERROR', message: 'La contraseña no puede estar vacía.' };

  }
}
