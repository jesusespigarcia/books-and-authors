import {
  authors,
  authorsDocuments,
  authorsDocumentsArray,
} from '../../test/data/authors.data';
import { AuthorsService } from './authors.service';
import { Author, AuthorDocument } from './schemas/author.schema';
import { Model, AnyKeys, AnyObject, HydratedDocument } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { NotFoundException } from '@nestjs/common';

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
    createSpy.mockResolvedValueOnce(authorsDocuments.author1Document as any);
    const authorCreated = await service.create(authors.author1);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toEqual(authors.author1);
    expect(authorCreated).toEqual(authorsDocuments.author1Document);
  });

  it('shoud return one author by id', async () => {
    expect.assertions(3);
    const findByIdSpy = jest
      .spyOn(model, 'findById')
      .mockResolvedValueOnce(authorsDocuments.author1Document);
    const authorFound = await service.findOne(
      authorsDocuments.author1Document._id,
    );
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy.mock.calls[0][0]).toBe(
      authorsDocuments.author1Document._id,
    );
    expect(authorFound).toEqual(authorsDocuments.author1Document);
  });

  it('shoud throw if one author by id dont exists', async () => {
    expect.assertions(1);
    jest.spyOn(model, 'findById').mockResolvedValueOnce(null);
    await expect(
      service.findOne(authorsDocuments.author1Document._id),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return all authors', async () => {
    expect.assertions(3);
    const findSpy = jest
      .spyOn(model, 'find')
      .mockResolvedValueOnce(authorsDocumentsArray);
    const authorsFound = await service.findAll();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy.mock.calls[0]).toEqual([]);
    expect(authorsFound).toEqual(authorsDocumentsArray);
  });

  it('shoud update author by id and return updated author', async () => {
    expect.assertions(4);
    const updateAuthorDto = new UpdateAuthorDto({ age: 25 });
    const findByIdAndUpdateSpy = jest
      .spyOn(model, 'findByIdAndUpdate')
      .mockResolvedValueOnce({
        ...authorsDocuments.author1Document,
        ...updateAuthorDto,
      });
    const authorUpdated = await service.update(
      authorsDocuments.author1Document._id,
      updateAuthorDto,
    );
    expect(findByIdAndUpdateSpy).toHaveBeenCalledTimes(1);
    expect(findByIdAndUpdateSpy.mock.calls[0][0]).toBe(
      authorsDocuments.author1Document._id,
    );
    expect(findByIdAndUpdateSpy.mock.calls[0][1]).toEqual(updateAuthorDto);
    expect(authorUpdated).toEqual({
      ...authorsDocuments.author1Document,
      ...updateAuthorDto,
    });
  });

  it('shoud throw if the author to update by id dont exists', async () => {
    expect.assertions(1);
    jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(null);
    await expect(
      service.update(authorsDocuments.author1Document._id, authors.author1),
    ).rejects.toThrow(NotFoundException);
  });

  it('shoud delete author by id and return author', async () => {
    expect.assertions(3);
    const findByIdAndRemoveSpy = jest
      .spyOn(model, 'findByIdAndRemove')
      .mockResolvedValueOnce(authorsDocuments.author1Document);
    const authorDeleted = await service.remove(
      authorsDocuments.author1Document._id,
    );
    expect(findByIdAndRemoveSpy).toHaveBeenCalledTimes(1);
    expect(findByIdAndRemoveSpy.mock.calls[0][0]).toBe(
      authorsDocuments.author1Document._id,
    );
    expect(authorDeleted).toEqual(authorsDocuments.author1Document);
  });

  it('shoud throw if the author to delete by id dont exists', async () => {
    expect.assertions(1);
    jest.spyOn(model, 'findByIdAndRemove').mockResolvedValueOnce(null);
    await expect(
      service.remove(authorsDocuments.author1Document._id),
    ).rejects.toThrow(NotFoundException);
  });
});
