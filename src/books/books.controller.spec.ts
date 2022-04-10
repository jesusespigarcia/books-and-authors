import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { books, booksDocuments } from './../../test/data/books.data';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: Model,
        },
      ],
    }).compile();
    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new book', async () => {
    expect.assertions(3);
    const createSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValueOnce(booksDocuments[0]);
    const bookCreated = await controller.create(books[0]);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toEqual(books[0]);
    expect(bookCreated).toEqual(booksDocuments[0]);
  });

  it('should return one book by id', async () => {
    expect.assertions(3);
    const findOneSpy = jest
      .spyOn(service, 'findOne')
      .mockResolvedValueOnce(booksDocuments[0]);
    const bookFound = await controller.findOne(booksDocuments[0]._id);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy.mock.calls[0][0]).toBe(booksDocuments[0]._id);
    expect(bookFound).toEqual(booksDocuments[0]);
  });

  it('should return all authors', async () => {
    expect.assertions(3);
    const findAllSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValueOnce(booksDocuments);
    const booksFound = await controller.findAll();
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy.mock.calls[0]).toEqual([]);
    expect(booksFound).toEqual(booksDocuments);
  });

  it('shoud update book by id and return updated book', async () => {
    expect.assertions(4);
    const updateBookDto = {
      description: 'Book 1 new description',
    };
    const updateSpy = jest.spyOn(service, 'update').mockResolvedValueOnce({
      ...booksDocuments[0],
      ...updateBookDto,
    });
    const bookUpdated = await controller.update(
      booksDocuments[0]._id,
      updateBookDto,
    );
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy.mock.calls[0][0]).toBe(booksDocuments[0]._id);
    expect(updateSpy.mock.calls[0][1]).toEqual(updateBookDto);
    expect(bookUpdated).toEqual({
      ...booksDocuments[0],
      ...updateBookDto,
    });
  });

  it('shoud delete book by id and return book', async () => {
    expect.assertions(3);
    const removeSpy = jest
      .spyOn(service, 'remove')
      .mockResolvedValueOnce(booksDocuments[0]);
    const bookDeleted = await controller.remove(booksDocuments[0]._id);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy.mock.calls[0][0]).toBe(booksDocuments[0]._id);
    expect(bookDeleted).toEqual(booksDocuments[0]);
  });
});
