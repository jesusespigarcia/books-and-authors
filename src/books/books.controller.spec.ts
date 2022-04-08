import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  books,
  booksDocuments,
  booksDocumentsArray,
} from './../../test/data/books.data';

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
      .mockResolvedValueOnce(booksDocuments.book1Document);
    const bookCreated = await controller.create(books.book1 as any);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toEqual(books.book1);
    expect(bookCreated).toEqual(booksDocuments.book1Document);
  });

  it('should return one book by id', async () => {
    expect.assertions(3);
    const findOneSpy = jest
      .spyOn(service, 'findOne')
      .mockResolvedValueOnce(booksDocuments.book1Document);
    const bookFound = await controller.findOne(
      booksDocuments.book1Document._id,
    );
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy.mock.calls[0][0]).toBe(booksDocuments.book1Document._id);
    expect(bookFound).toEqual(booksDocuments.book1Document);
  });

  it('should return all authors', async () => {
    expect.assertions(3);
    const findAllSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValueOnce(booksDocumentsArray);
    const booksFound = await controller.findAll();
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy.mock.calls[0]).toEqual([]);
    expect(booksFound).toEqual(booksDocumentsArray);
  });

  it('shoud update book by id and return updated book', async () => {
    expect.assertions(4);
    const updateBookDto = {
      description: 'Book 1 new description',
    };
    const updateSpy = jest.spyOn(service, 'update').mockResolvedValueOnce({
      ...booksDocuments.book1Document,
      ...updateBookDto,
    } as any);
    const bookUpdated = await controller.update(
      booksDocuments.book1Document._id,
      updateBookDto,
    );
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy.mock.calls[0][0]).toBe(booksDocuments.book1Document._id);
    expect(updateSpy.mock.calls[0][1]).toEqual(updateBookDto);
    expect(bookUpdated).toEqual({
      ...booksDocuments.book1Document,
      ...updateBookDto,
    });
  });

  it('shoud delete book by id and return book', async () => {
    expect.assertions(3);
    const removeSpy = jest
      .spyOn(service, 'remove')
      .mockResolvedValueOnce(booksDocuments.book1Document);
    const bookDeleted = await controller.remove(
      booksDocuments.book1Document._id,
    );
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy.mock.calls[0][0]).toBe(booksDocuments.book1Document._id);
    expect(bookDeleted).toEqual(booksDocuments.book1Document);
  });
});
