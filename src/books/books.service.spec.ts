import { books, booksDocuments } from './../../test/data/books.data';
import { BooksService } from './books.service';
import { Book, BookDocument } from './schemas/book.schema';
import { Model, AnyKeys, AnyObject, HydratedDocument } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BookNotFoundException } from './exceptions/bookNotFoundException';

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<BookDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<BookDocument>>(getModelToken(Book.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new book', async () => {
    expect.assertions(3);
    type CreateOp<T> = (
      doc: AnyKeys<T> | AnyObject,
    ) => Promise<HydratedDocument<T>>;
    const createSpy = jest.spyOn(
      model,
      'create',
    ) as unknown as jest.MockedFunction<CreateOp<BookDocument>>;
    createSpy.mockResolvedValueOnce(booksDocuments[0] as any);
    const bookCreated = await service.create(books[0]);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toEqual(books[0]);
    expect(bookCreated).toEqual(booksDocuments[0]);
  });

  it('shoud return one book by id', async () => {
    expect.assertions(3);
    const findByIdSpy = jest
      .spyOn(model, 'findById')
      .mockResolvedValueOnce(booksDocuments[0]);
    const bookFound = await service.findOne(booksDocuments[0]._id);
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy.mock.calls[0][0]).toBe(booksDocuments[0]._id);
    expect(bookFound).toEqual(booksDocuments[0]);
  });

  it('shoud throw if one book by id dont exists', async () => {
    expect.assertions(1);
    jest.spyOn(model, 'findById').mockResolvedValueOnce(null);
    await expect(service.findOne(booksDocuments[0]._id)).rejects.toThrow(
      BookNotFoundException,
    );
  });

  it('should return all books', async () => {
    expect.assertions(3);
    const findSpy = jest
      .spyOn(model, 'find')
      .mockResolvedValueOnce(booksDocuments);
    const booksFound = await service.findAll();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy.mock.calls[0]).toEqual([]);
    expect(booksFound).toEqual(booksDocuments);
  });

  it('shoud update book by id and return updated book', async () => {
    expect.assertions(4);
    const updateBookDto = {
      description: 'Book 1 new description',
    };
    const findByIdAndUpdateSpy = jest
      .spyOn(model, 'findByIdAndUpdate')
      .mockResolvedValueOnce({
        ...booksDocuments[0],
        ...updateBookDto,
      });
    const bookUpdated = await service.update(
      booksDocuments[0]._id,
      updateBookDto,
    );
    expect(findByIdAndUpdateSpy).toHaveBeenCalledTimes(1);
    expect(findByIdAndUpdateSpy.mock.calls[0][0]).toBe(booksDocuments[0]._id);
    expect(findByIdAndUpdateSpy.mock.calls[0][1]).toEqual(updateBookDto);
    expect(bookUpdated).toEqual({
      ...booksDocuments[0],
      ...updateBookDto,
    });
  });

  it('shoud throw if the book to update by id dont exists', async () => {
    expect.assertions(1);
    jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(null);
    await expect(
      service.update(booksDocuments[0]._id, books[0]),
    ).rejects.toThrow(BookNotFoundException);
  });

  it('shoud delete book by id and return book', async () => {
    expect.assertions(3);
    const findByIdAndRemoveSpy = jest
      .spyOn(model, 'findByIdAndRemove')
      .mockResolvedValueOnce(booksDocuments[0]);
    const bookDeleted = await service.remove(booksDocuments[0]._id);
    expect(findByIdAndRemoveSpy).toHaveBeenCalledTimes(1);
    expect(findByIdAndRemoveSpy.mock.calls[0][0]).toBe(booksDocuments[0]._id);
    expect(bookDeleted).toEqual(booksDocuments[0]);
  });

  it('shoud throw if the book to delete by id dont exists', async () => {
    expect.assertions(1);
    jest.spyOn(model, 'findByIdAndRemove').mockResolvedValueOnce(null);
    await expect(service.remove(booksDocuments[0]._id)).rejects.toThrow(
      BookNotFoundException,
    );
  });
});
