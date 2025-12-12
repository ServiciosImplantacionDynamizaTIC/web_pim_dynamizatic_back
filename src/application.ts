import 'dotenv/config';  // Importa y configura dotenv | Permite Leer GLOBALMENTE las Variables de entorno (.env)
// A U T E N T I C A C I Ó N - Y - A U T O R I Z A C I Ó N
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {SECURITY_SCHEME_SPEC} from '@loopback/authentication-jwt';
import {AuthorizationBindings, AuthorizationComponent, AuthorizationDecision, AuthorizationOptions, AuthorizationTags} from '@loopback/authorization';
//---------------------------------------------------------
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import { BcryptHasher } from './services/hash.password.bcryptjs';
import path from 'path';
import {MySequence} from './sequence';
import { PasswordHasherBindings, TokenServiceBindings, TokenServiceConstants, RefreshTokenServiceBindings, RefreshTokenConstants, UserServiceBindings } from './keys';
import {RefrescarTokenService} from './services/refresh-token.service';
import { MyAuthorizationProvider } from './provider/MyAuthorizationProvider';
import { JWTService } from './services/jwt-services';
import { JWTAuthenticationStrategy } from './strategy/jwt-strategy';
import { MyUserService } from './services/user-service';
import { CompruebaImagenController } from './controllers/compruebaImagen.controller';
import { TraduccionInterceptor } from './interceptors/traduccion.interceptor';
import { EscrituraTraduccionInterceptor } from './interceptors/escritura-traduccion.interceptor';
import { TraduccionService } from './services/traduccion.service';

export {ApplicationConfig};

export class ApiBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.bind('services.CompruebaImagenController').toClass(CompruebaImagenController);
    //console.log('variable en aplication:', process.env.HOST_LOCAL);

    this.setUpBindings(); //-> LLamamos a los Bindings

    // Add security spec
    this.addSecuritySpec();
    
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy); // Llamamos a la estrategia que creamos para la autenticación de JWT

    //Configuramos las opciones de autorización
    const authOptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };
    
    this.configure(AuthorizationBindings.COMPONENT).to(authOptions);
    this.component(AuthorizationComponent); // La definimos de manera GLOBAL

    // Set up the custom sequence
    this.sequence(MySequence); // Intercepta y recibe todas las peticiones que recibe nuestra API (Valida el token)

    this.component(AuthenticationComponent); // Las definimos de manera GLOBAL

    // Configurar interceptor de traducciones DESPUÉS de los componentes principales
    this.setupTraduccionInterceptor();

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setUpBindings(): void {

    this.bind('Provider.MyAuthorizationProvider').toProvider(MyAuthorizationProvider).tag(AuthorizationTags.AUTHORIZER); //-> Authorización a la API
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE); //-> Token secreto y su valor
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE); // Duración del token
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService); // Servicio que usamos para generar nuestro token

    /// refresh bindings
    this.bind(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE).toClass(RefrescarTokenService);
    // refresh token bindings
    this.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(RefreshTokenConstants.REFRESH_SECRET_VALUE);
    this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(RefreshTokenConstants.REFRESH_EXPIRES_IN_VALUE);
    this.bind(RefreshTokenServiceBindings.REFRESH_ISSUER).to(RefreshTokenConstants.REFRESH_ISSUER_VALUE);

    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher); //-> Encriptación del password de usuario
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService); // Servicio que usamos para validar el usuario
    
    // Binding para el servicio de traducciones
    this.bind('services.TraduccionService').toClass(TraduccionService);
  }

  setupTraduccionInterceptor(): void {
    console.log('🚀 Registrando TraduccionInterceptor...');
    
    // Método 1: Usando createBindingFromClass
    const binding = createBindingFromClass(TraduccionInterceptor, {
      key: 'interceptors.TraduccionInterceptor'
    });
    this.add(binding);
    
    // Método 2: Registrar como interceptor global
    this.interceptor(TraduccionInterceptor, {
      global: true,
      group: 'translation',
    });

    // Registrar interceptor de escritura
    console.log('🚀 Registrando EscrituraTraduccionInterceptor...');
    this.interceptor(EscrituraTraduccionInterceptor, {
      global: true,
      group: 'translation-write',
    });
    
    console.log('✅ Interceptores de traducción registrados correctamente');
  }
  addSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'ApiBackend application',
        version: '1.0.0',
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC}, // autenticación con 'jwt'
      security: [
        {
          jwt: [],
        },
      ],
      servers: [{url: '/'}],
    });
  }
}
