import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './config/config.validation';
import { DbService } from './db-service/db.service';

@Module({
  imports: [
    AuthModule,
    AuthorsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbService,
    }),
    BooksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
