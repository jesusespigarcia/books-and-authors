import {
  authors,
  authorsDocuments,
  authorsDocumentsArray,
} from '../../test/data/authors.data';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { Author } from './schemas/author.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UpdateAuthorDto } from './dto/update-author.dto';

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: AuthorsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        AuthorsService,
        {
          provide: getModelToken(Author.name),
          useValue: Model,
        },
      ],
    }).compile();
    controller = module.get<AuthorsController>(AuthorsController);
    service = module.get<AuthorsService>(AuthorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new author', async () => {
    expect.assertions(3);
    const createSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValueOnce(authorsDocuments.author1Document);
    const authorCreated = await controller.create(authors.author1);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toEqual(authors.author1);
    expect(authorCreated).toEqual(authorsDocuments.author1Document);
  });

  it('shoud return one author by id', async () => {
    expect.assertions(3);
    const findOneSpy = jest
      .spyOn(service, 'findOne')
      .mockResolvedValueOnce(authorsDocuments.author1Document);
    const authorFound = await controller.findOne(
      authorsDocuments.author1Document._id,
    );
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy.mock.calls[0][0]).toBe(
      authorsDocuments.author1Document._id,
    );
    expect(authorFound).toEqual(authorsDocuments.author1Document);
  });

  it('should return all authors', async () => {
    expect.assertions(3);
    const findAllSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValueOnce(authorsDocumentsArray);
    const authorsFound = await controller.findAll();
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy.mock.calls[0]).toEqual([]);
    expect(authorsFound).toEqual(authorsDocumentsArray);
  });

  it('shoud update author by id and return updated author', async () => {
    expect.assertions(4);
    const updateAuthorDto = new UpdateAuthorDto({ age: 25 });
    const updateSpy = jest.spyOn(service, 'update').mockResolvedValueOnce({
      ...authorsDocuments.author1Document,
      ...updateAuthorDto,
    });
    const authorUpdated = await controller.update(
      authorsDocuments.author1Document._id,
      updateAuthorDto,
    );
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy.mock.calls[0][0]).toBe(
      authorsDocuments.author1Document._id,
    );
    expect(updateSpy.mock.calls[0][1]).toEqual(updateAuthorDto);
    expect(authorUpdated).toEqual({
      ...authorsDocuments.author1Document,
      ...updateAuthorDto,
    });
  });

  it('shoud delete author by id and return author', async () => {
    expect.assertions(3);
    const removeSpy = jest
      .spyOn(service, 'remove')
      .mockResolvedValueOnce(authorsDocuments.author1Document);
    const authorDeleted = await controller.remove(
      authorsDocuments.author1Document._id,
    );
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy.mock.calls[0][0]).toBe(
      authorsDocuments.author1Document._id,
    );
    expect(authorDeleted).toEqual(authorsDocuments.author1Document);
  });
});
