import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    AuthModule,
    AuthorsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/booksAndAuthors'),
    BooksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
