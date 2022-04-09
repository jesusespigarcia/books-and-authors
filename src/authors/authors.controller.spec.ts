import { authors, authorsDocuments } from '../../test/data/authors.data';
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
      .mockResolvedValueOnce(authorsDocuments[0]);
    const authorCreated = await controller.create(authors[0]);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toEqual(authors[0]);
    expect(authorCreated).toEqual(authorsDocuments[0]);
  });

  it('shoud return one author by id', async () => {
    expect.assertions(3);
    const findOneSpy = jest
      .spyOn(service, 'findOne')
      .mockResolvedValueOnce(authorsDocuments[0]);
    const authorFound = await controller.findOne(authorsDocuments[0]._id);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy.mock.calls[0][0]).toBe(authorsDocuments[0]._id);
    expect(authorFound).toEqual(authorsDocuments[0]);
  });

  it('should return all authors', async () => {
    expect.assertions(3);
    const findAllSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValueOnce(authorsDocuments);
    const authorsFound = await controller.findAll();
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy.mock.calls[0]).toEqual([]);
    expect(authorsFound).toEqual(authorsDocuments);
  });

  it('shoud update author by id and return updated author', async () => {
    expect.assertions(4);
    const updateAuthorDto = new UpdateAuthorDto({ age: 25 });
    const updateSpy = jest.spyOn(service, 'update').mockResolvedValueOnce({
      ...authorsDocuments[0],
      ...updateAuthorDto,
    });
    const authorUpdated = await controller.update(
      authorsDocuments[0]._id,
      updateAuthorDto,
    );
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy.mock.calls[0][0]).toBe(authorsDocuments[0]._id);
    expect(updateSpy.mock.calls[0][1]).toEqual(updateAuthorDto);
    expect(authorUpdated).toEqual({
      ...authorsDocuments[0],
      ...updateAuthorDto,
    });
  });

  it('shoud delete author by id and return author', async () => {
    expect.assertions(3);
    const removeSpy = jest
      .spyOn(service, 'remove')
      .mockResolvedValueOnce(authorsDocuments[0]);
    const authorDeleted = await controller.remove(authorsDocuments[0]._id);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy.mock.calls[0][0]).toBe(authorsDocuments[0]._id);
    expect(authorDeleted).toEqual(authorsDocuments[0]);
  });
});
