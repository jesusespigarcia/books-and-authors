import { authors, authorsDocuments } from '../../test/data/authors.data';
import { AuthorsService } from './authors.service';
import { Author, AuthorDocument } from './schemas/author.schema';
import { Model, AnyKeys, AnyObject, HydratedDocument } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorNotFoundException } from './exceptions/authorNotFoundException';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let model: Model<AuthorDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getModelToken(Author.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    model = module.get<Model<AuthorDocument>>(getModelToken(Author.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new author', async () => {
    expect.assertions(3);
    type CreateOp<T> = (
      doc: AnyKeys<T> | AnyObject,
    ) => Promise<HydratedDocument<T>>;
    const createSpy = jest.spyOn(
      model,
      'create',
    ) as unknown as jest.MockedFunction<CreateOp<AuthorDocument>>;
    createSpy.mockResolvedValueOnce(authorsDocuments[0] as any);
    const authorCreated = await service.create(authors[0]);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toEqual(authors[0]);
    expect(authorCreated).toEqual(authorsDocuments[0]);
  });

  it('shoud return one author by id', async () => {
    expect.assertions(3);
    const findByIdSpy = jest
      .spyOn(model, 'findById')
      .mockResolvedValueOnce(authorsDocuments[0]);
    const authorFound = await service.findOne(authorsDocuments[0]._id);
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy.mock.calls[0][0]).toBe(authorsDocuments[0]._id);
    expect(authorFound).toEqual(authorsDocuments[0]);
  });

  it('shoud throw if one author by id dont exists', async () => {
    expect.assertions(1);
    jest.spyOn(model, 'findById').mockResolvedValueOnce(null);
    await expect(service.findOne(authorsDocuments[0]._id)).rejects.toThrow(
      AuthorNotFoundException,
    );
  });

  it('should return all authors', async () => {
    expect.assertions(3);
    const findSpy = jest
      .spyOn(model, 'find')
      .mockResolvedValueOnce(authorsDocuments);
    const authorsFound = await service.findAll();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy.mock.calls[0]).toEqual([]);
    expect(authorsFound).toEqual(authorsDocuments);
  });

  it('shoud update author by id and return updated author', async () => {
    expect.assertions(4);
    const updateAuthorDto = new UpdateAuthorDto({ age: 25 });
    const findByIdAndUpdateSpy = jest
      .spyOn(model, 'findByIdAndUpdate')
      .mockResolvedValueOnce({
        ...authorsDocuments[0],
        ...updateAuthorDto,
      });
    const authorUpdated = await service.update(
      authorsDocuments[0]._id,
      updateAuthorDto,
    );
    expect(findByIdAndUpdateSpy).toHaveBeenCalledTimes(1);
    expect(findByIdAndUpdateSpy.mock.calls[0][0]).toBe(authorsDocuments[0]._id);
    expect(findByIdAndUpdateSpy.mock.calls[0][1]).toEqual(updateAuthorDto);
    expect(authorUpdated).toEqual({
      ...authorsDocuments[0],
      ...updateAuthorDto,
    });
  });

  it('shoud throw if the author to update by id dont exists', async () => {
    expect.assertions(1);
    jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(null);
    await expect(
      service.update(authorsDocuments[0]._id, authors[0]),
    ).rejects.toThrow(AuthorNotFoundException);
  });

  it('shoud delete author by id and return author', async () => {
    expect.assertions(3);
    const findByIdAndRemoveSpy = jest
      .spyOn(model, 'findByIdAndRemove')
      .mockResolvedValueOnce(authorsDocuments[0]);
    const authorDeleted = await service.remove(authorsDocuments[0]._id);
    expect(findByIdAndRemoveSpy).toHaveBeenCalledTimes(1);
    expect(findByIdAndRemoveSpy.mock.calls[0][0]).toBe(authorsDocuments[0]._id);
    expect(authorDeleted).toEqual(authorsDocuments[0]);
  });

  it('shoud throw if the author to delete by id dont exists', async () => {
    expect.assertions(1);
    jest.spyOn(model, 'findByIdAndRemove').mockResolvedValueOnce(null);
    await expect(service.remove(authorsDocuments[0]._id)).rejects.toThrow(
      AuthorNotFoundException,
    );
  });
});
