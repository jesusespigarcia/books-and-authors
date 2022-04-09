import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Author } from '../src/authors/schemas/author.schema';

const author1: Author = {
  name: 'Author1',
  age: 44,
};

const author2: Author = {
  name: 'Author2',
  age: 41,
};

describe('AuthorController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/testBooksAndAuthors'),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ disableErrorMessages: false, transform: true }),
    );

    await app.init();
  });

  afterEach(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
  });

  it('/authors (GET)', async () => {
    await request(app.getHttpServer()).get('/authors').expect(200);
  });

  it('creates a author', async () => {
    const authorCreated = await request(app.getHttpServer())
      .post('/authors')
      .send(author1)
      .expect(201);
    expect(authorCreated.body.name).toBe(author1.name);
    expect(authorCreated.body.age).toBe(author1.age);
  });

  it('creates a author with bad payload', async () => {
    await request(app.getHttpServer())
      .post('/authors')
      .send({
        name: author1.name,
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/authors')
      .send({
        age: author1.age,
      })
      .expect(400);
  });

  it('creates authors', async () => {
    await request(app.getHttpServer())
      .post('/authors')
      .send(author1)
      .expect(201);
    await request(app.getHttpServer())
      .post('/authors')
      .send(author2)
      .expect(201);
    const authors = await request(app.getHttpServer()).get('/authors');
    expect(authors.body).toHaveLength(2);
    expect(authors.body[0].name).toBe(author1.name);
    expect(authors.body[0].age).toBe(author1.age);
    expect(authors.body[1].name).toBe(author2.name);
    expect(authors.body[1].age).toBe(author2.age);
  });

  it('get author with invalid id', async () => {
    await request(app.getHttpServer()).get('/authors/1').expect(400);
  });

  it('get author that doesnt exists', async () => {
    await request(app.getHttpServer()).get('/authors/111111111111').expect(404);
  });

  it('get author', async () => {
    const authorCreated = await request(app.getHttpServer())
      .post('/authors')
      .send(author1)
      .expect(201);

    const author = await request(app.getHttpServer())
      .get(`/authors/${authorCreated.body._id}`)
      .expect(200);
    expect(author.body.name).toBe(author1.name);
    expect(author.body.age).toBe(author1.age);
  });

  it('update author with invalid id', async () => {
    await request(app.getHttpServer())
      .patch('/authors/1')
      .send(author1)
      .expect(400);
  });

  it('update author that doesnt exists', async () => {
    await request(app.getHttpServer())
      .patch('/authors/111111111111')
      .send(author1)
      .expect(404);
  });

  it('update author with all properties', async () => {
    const authorCreated = await request(app.getHttpServer())
      .post('/authors')
      .send(author1)
      .expect(201);

    let author = await request(app.getHttpServer())
      .patch(`/authors/${authorCreated.body._id}`)
      .send(author2)
      .expect(200);
    expect(author.body.name).toBe(author2.name);
    expect(author.body.age).toBe(author2.age);
    author = await request(app.getHttpServer())
      .get(`/authors/${authorCreated.body._id}`)
      .expect(200);
    expect(author.body.name).toBe(author2.name);
    expect(author.body.age).toBe(author2.age);
  });

  it('update author with partial properties', async () => {
    const authorCreated = await request(app.getHttpServer())
      .post('/authors')
      .send(author1)
      .expect(201);

    let author = await request(app.getHttpServer())
      .patch(`/authors/${authorCreated.body._id}`)
      .send({ name: author2.name })
      .expect(200);
    expect(author.body.name).toBe(author2.name);
    expect(author.body.age).toBe(author1.age);
    author = await request(app.getHttpServer())
      .patch(`/authors/${authorCreated.body._id}`)
      .send({ age: author2.age })
      .expect(200);
    expect(author.body.name).toBe(author2.name);
    expect(author.body.age).toBe(author2.age);
    author = await request(app.getHttpServer())
      .get(`/authors/${authorCreated.body._id}`)
      .expect(200);
    expect(author.body.name).toBe(author2.name);
    expect(author.body.age).toBe(author2.age);
  });

  it('delete author with invalid id', async () => {
    await request(app.getHttpServer()).delete('/authors/1').expect(400);
  });

  it('delete author that doesnt exists', async () => {
    await request(app.getHttpServer())
      .delete('/authors/111111111111')
      .expect(404);
  });

  it('delete author', async () => {
    const authorCreated = await request(app.getHttpServer())
      .post('/authors')
      .send(author1)
      .expect(201);

    let author = await request(app.getHttpServer())
      .delete(`/authors/${authorCreated.body._id}`)
      .expect(200);
    expect(author.body.name).toBe(author1.name);
    expect(author.body.age).toBe(author1.age);
    author = await request(app.getHttpServer())
      .get(`/authors/${authorCreated.body._id}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
