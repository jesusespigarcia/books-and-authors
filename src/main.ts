import { ConfigService } from '@nestjs/config';
import { ValidationPipe, LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({ disableErrorMessages: false, transform: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Books and Authors API')
    .setDescription('API para gestionar autores y libros')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Books and Authors API docs',
  });

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  app.useLogger(configService.get<LogLevel[]>('log.levels'));
  await app.listen(configService.get<number>('server.port'));
}
bootstrap();
