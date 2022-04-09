import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { validate } from '../src/config/config.validation';
import { DbService } from '../src/db/db.service';
import { Book } from '../src/books/schemas/book.schema';

const book1: Book = {
  title: 'Book1',
  description: 'Book1 description',
  author: '6251cc7925e9b6bfa262d8e3',
};

const book2: Book = {
  title: 'Book2',
  description: 'Book2 description',
  author: '6251cc7925e9b6bfa262d8e5',
};

describe('BookController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          validate,
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useClass: DbService,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ disableErrorMessages: false, transform: true }),
    );

    await app.init();
    configService = moduleFixture.get<ConfigService>(ConfigService);
    const login = {
      username: configService.get<string>('login.user'),
      password: configService.get<string>('login.password'),
    };
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(login)
      .expect(200);
    token = loginResponse.body.accessToken;
  });

  afterEach(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
  });

  it('/books (GET)', async () => {
    await request(app.getHttpServer()).get('/books').expect(200);
  });

  it('creates a book with valid credentials', async () => {
    const bookCreated = await request(app.getHttpServer())
      .post('/books')
      .send(book1)
      .set('Authorization', `bearer ${token}`)
      .expect(201);
    expect(bookCreated.body.title).toBe(book1.title);
    expect(bookCreated.body.description).toBe(book1.description);
  });

  it('creates a book with invalid credentials', async () => {
    await request(app.getHttpServer()).post('/books').send(book1).expect(401);
  });

  it('creates a book with bad payload', async () => {
    await request(app.getHttpServer())
      .post('/books')
      .send({
        title: book1.title,
      })
      .set('Authorization', `bearer ${token}`)
      .expect(400);
    await request(app.getHttpServer())
      .post('/books')
      .send({
        description: book1.description,
      })
      .set('Authorization', `bearer ${token}`)
      .expect(400);
  });

  it('creates books', async () => {
    await request(app.getHttpServer())
      .post('/books')
      .send(book1)
      .set('Authorization', `bearer ${token}`)
      .expect(201);
    await request(app.getHttpServer())
      .post('/books')
      .send(book2)
      .set('Authorization', `bearer ${token}`)
      .expect(201);
    const books = await request(app.getHttpServer()).get('/books');
    expect(books.body).toHaveLength(2);
    expect(books.body[0].title).toBe(book1.title);
    expect(books.body[0].description).toBe(book1.description);
    expect(books.body[1].title).toBe(book2.title);
    expect(books.body[1].description).toBe(book2.description);
  });

  it('get book with invalid id', async () => {
    await request(app.getHttpServer()).get('/books/1').expect(400);
  });

  it('get book that doesnt exists', async () => {
    await request(app.getHttpServer()).get('/books/111111111111').expect(404);
  });

  it('get book', async () => {
    const bookCreated = await request(app.getHttpServer())
      .post('/books')
      .send(book1)
      .set('Authorization', `bearer ${token}`)
      .expect(201);

    const book = await request(app.getHttpServer())
      .get(`/books/${bookCreated.body._id}`)
      .expect(200);
    expect(book.body.title).toBe(book1.title);
    expect(book.body.description).toBe(book1.description);
  });

  it('update book with invalid id', async () => {
    await request(app.getHttpServer())
      .patch('/books/1')
      .send(book1)
      .set('Authorization', `bearer ${token}`)
      .expect(400);
  });

  it('update book that doesnt exists', async () => {
    await request(app.getHttpServer())
      .patch('/books/111111111111')
      .send(book1)
      .set('Authorization', `bearer ${token}`)
      .expect(404);
  });

  it('update book with all properties', async () => {
    const bookCreated = await request(app.getHttpServer())
      .post('/books')
      .send(book1)
      .set('Authorization', `bearer ${token}`)
      .expect(201);

    let book = await request(app.getHttpServer())
      .patch(`/books/${bookCreated.body._id}`)
      .send(book2)
      .set('Authorization', `bearer ${token}`)
      .expect(200);
    expect(book.body.title).toBe(book2.title);
    expect(book.body.description).toBe(book2.description);
    book = await request(app.getHttpServer())
      .get(`/books/${bookCreated.body._id}`)
      .expect(200);
    expect(book.body.title).toBe(book2.title);
    expect(book.body.description).toBe(book2.description);
  });

  it('update book with partial properties', async () => {
    const bookCreated = await request(app.getHttpServer())
      .post('/books')
      .send(book1)
      .set('Authorization', `bearer ${token}`)
      .expect(201);

    let book = await request(app.getHttpServer())
      .patch(`/books/${bookCreated.body._id}`)
      .send({ title: book2.title })
      .set('Authorization', `bearer ${token}`)
      .expect(200);
    expect(book.body.title).toBe(book2.title);
    expect(book.body.description).toBe(book1.description);
    book = await request(app.getHttpServer())
      .patch(`/books/${bookCreated.body._id}`)
      .send({ description: book2.description })
      .set('Authorization', `bearer ${token}`)
      .expect(200);
    expect(book.body.title).toBe(book2.title);
    expect(book.body.description).toBe(book2.description);
    book = await request(app.getHttpServer())
      .get(`/books/${bookCreated.body._id}`)
      .expect(200);
    expect(book.body.title).toBe(book2.title);
    expect(book.body.description).toBe(book2.description);
  });

  it('update a book with invalid credentials', async () => {
    await request(app.getHttpServer())
      .patch('/books/1')
      .send(book1)
      .expect(401);
  });

  it('delete book with invalid id', async () => {
    await request(app.getHttpServer())
      .delete('/books/1')
      .set('Authorization', `bearer ${token}`)
      .expect(400);
  });

  it('delete book that doesnt exists', async () => {
    await request(app.getHttpServer())
      .delete('/books/111111111111')
      .set('Authorization', `bearer ${token}`)
      .expect(404);
  });

  it('delete book', async () => {
    const bookCreated = await request(app.getHttpServer())
      .post('/books')
      .send(book1)
      .set('Authorization', `bearer ${token}`)
      .expect(201);
    let book = await request(app.getHttpServer())
      .delete(`/books/${bookCreated.body._id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200);
    expect(book.body.title).toBe(book1.title);
    expect(book.body.description).toBe(book1.description);
    book = await request(app.getHttpServer())
      .get(`/books/${bookCreated.body._id}`)
      .expect(404);
  });

  it('delete a book with invalid credentials', async () => {
    await request(app.getHttpServer()).delete('/books/1').expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
