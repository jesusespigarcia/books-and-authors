import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    AuthorsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/booksAndAuthors'),
    BooksModule,
  ],
})
export class AppModule {}
