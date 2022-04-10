  <p align="center">Prueba técnica de un API CRUD de Libros y Autores.</p>

## Descripción

API CRUD de libros y autores realizado con [Nestjs](https://github.com/nestjs/nest).

## Instalación

```bash
$ npm install
```

## Ejecución de la aplicación

Para ejecutar la aplicación se necesita una base de datos MongoDB. Para levantar una instancia en local ejecutar:

```bash
$ docker compose up
```

Una vez levantada la instancia ejecutar:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

Para ejecutar los test lanzar:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Para los tests unitarios se ha utilizado jest y para los e2e jest y supertest
## Organización del código

El código está organizado por módulos de funcionalidad.

Nombre del directorio | Funcionalidad
--------------------- | -------------
auth                  | autenticación. Login y JWT.
authors               | autores.
books                 | libros.
config                | configuración de la aplicación mediante propiedades.
db                    | servicio de base de datos y su configuración.
filters               | exception filters de nestjs para capturar y tratar excepciones.
middleware            | loggin middleware de nestjs para gestionar los logs.
transformers          | pipes de nestjs para validación de parámetros y payload de entrada.

Dentro de cada directorio nos podemos encontrar los siguientes subdirectorios:

Nombre del subdirectorio | Funcionalidad
---------------------    | -------------
dto                      | dto's de entrada y salida de información.
guards                   | guards de nestjs para comprobar si se puede .ejecutar la ruta o no dependiendo de las credenciales.
strategies               | Estrategias de passport para usuario/password y token jwt.
exceptions               | Custom exceptions utilizadas dentro del módulo.
schemas                  | Schemas de Mongoose.

## Gestión de errores y códigos de estado

Para la gestión de errores se ha utilizado el mecanismo de nestjs para controlar las excepciones no manejadas, exception filters.
Se utilizan tanto excepciones predeterminadas, ej: BadRequestException, como custom exceptions. También se han creado exception filters para capturar errores de mongoose.

Para la gestión de códigos de estado se utiliza la anotación @HttpCode si es necesario cambiar el código por defecto que utiliza nestjs. Para las excepciones y errores se utilizan los códigos asociados a la excepción lanzada. Para las custom exceptions se utilizan los códigos de HttpStatus que ofrece nestjs.

## Configuración

Dentro del directorio config tenemos los siguientes ficheros:

fichero | descripción
------- | -----------
config.development | valores específicos del entorno de desarrollo.
config.production  | valores específicos del entorno de producción.
config.test        | valores específicos del entorno de test.
config.validation  | Se realiza la validación de los valores con información sensible que se pasan por variables de entorno.
configuration      | unión de los valores de configuración del entorno y variables de entorno.

Configuramos el ConfigModule de nestjs de la siguiente forma:

```bash
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validate,
  }),
```


En load le pasamos la función exportada del fichero configuration.ts y en validate la función exportada del fichero config.validation.ts.

En config.validation.ts se pueden indicar los valores por defecto de las variables de entorno cuando no existen. Si no se indica valor por defecto y no se pasa la variable de entorno a la hora de ejecutar la aplicación, se lanza un error y no se deja continuar.

Variables de entorno:

nombre | descripción
------ | -----------
NODE_ENV          | Posibles valores: development, production, test.
JWT_SECRET        | Secreto utilizado a la hora de generar y comprobar la validez de los tokens JWT.
LOGIN_USER        | Usuario para poder logarse y tener acceso a los endpoints securizados.
LOGIN_PASSWORD    | Password para poder logarse y tener acceso a los endpoints securizados.
DB_CONNECTION_URI | Uri de conexión a la base de datos.

## Autenticación

Se ha creado una autenticación sencilla, sin gestión de usuarios. Existe un único usuario con el que logarse que se configura por variables de entorno, LOGIN_USER y LOGIN_PASSWORD.

Se utiliza @nestjs/passport para la configuración de estrategias.

El endpoint para el login es /auth/login y se utiliza estrategia local. Comprueba que el usuario y password de la request sean correctos y devuelve el token JWT necesario para acceder a los endpoints securizados (post, patch y delete). El endpoint está protegido por un guard que es el encargado de rellenar la propiedad user en request si todo va correcto.

El token jwt se pasa mediante cabecera Bearer y la comprobación de la validez se realiza mediante un guard en los endpoints securizados (post, patch y delete). Se utiliza la estrategia jwt de passport.

## Base de datos

La base de datos utilizada es MongoDB. Como ODM se utiliza Mongoose.
Para desarrollo se puede levantar una instancia de MongoDB ejecutando en el directorio raiz del proyecto:

```
docker compose up
``` 

Por si no se dispone de un cliente de administración de MongoDB como MongoDB Compass o Robo 3T, el comando anterior también levanta una instancia de Mongo Express en localhost:8081

La URI de conexión se indica mediante la variable de entorno DB_CONNECTION_URI. Si no se indica la conexión por defecto es a la instancia levantada en local.

## Documentación API

La documentación de la API en formato openAPI se puede consultar con Swagger UI en el endpoint /api o en formato json en el endpoint /api-json.

Para la generación de la documentación se ha usado el plugin de swagger configurado en el fichero nest-cli.json:

```
  "compilerOptions": {
    "plugins": [
      "@nestjs/swagger"
    ]
  }
```

En los controladores se han usado las anotaciones @APIxxxxx necesarias para complementar la documentación automática que hace el plugin.

## Gestión de Logs

Se puede configurar el nivel de logs que queremos mostrar para los diferentes entornos con la propiedad log.levels de los ficheros config.xxxxx.ts.

Se ha creado un middleware logger.middleware.ts aplicado a todas las rutas para mostrar logs de las llamadas recibidas y su código de estado resultado. 

Si el código de estado es mayor o igual a 500 el logger crea un mensaje de error.
Si el código de estado es mayor o igual a 400 el logger crea un mensaje de warning.
Sino el logger crea un mensaje de log
También se genera un mensaje de verbose con el payload recibido en la request.

## Validación

La validación se realiza con class-validator y ValidationPipe de nestjs. Los dtos se anotan con las anotaciones correspondientes de class-validator y en main.ts activamos la auto validación:

```
  app.useGlobalPipes(
    new ValidationPipe({ disableErrorMessages: false, transform: true }),
  );
```

Se crean custom pipes en la carpeta transformers para validar que los string que nos llegan por parámetro y en el body son ObjectIds validos de MongoDB.

```
  async update(
    @Param('id', new ValidationObjectIdPipe()) id: string,
    @Body(new ValidationBookDtoPipe()) updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return await this.booksService.update(id, updateBookDto);
  }
```

## Exportación a CSV

En la parte de mongoose se ha utilizado lean para mejorar el rendimiento.
Se ha utilizado el paquete json2csv y su funcionalidad de streaming api para la generación de los ficheros csv.

```
  findAllStream(): JSON2CSVTransform<string> {
    const csvTransformer = new Transform({}, { objectMode: true });
    return this.authorModel.find().lean().cursor().pipe(csvTransformer);
  }
```

En la parte de nestjs se ha utilizado StreamableFile para el tratamiento del stream.

```
  getCsv(@Response({ passthrough: true }) res): StreamableFile {
    res.set({
      'Content-Type': 'application/CSV',
      'Content-Disposition': 'attachment; filename="authors.csv"',
    });
    return new StreamableFile(this.authorsService.findAllStream());
  }
```

