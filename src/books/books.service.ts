import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookDocument } from './schemas/book.schema';
import JSON2CSVTransform from 'json2csv/JSON2CSVTransform';
import { Transform } from 'json2csv';
import { BookNotFoundException } from './exceptions/bookNotFoundException';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return await this.bookModel.create(createBookDto);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookModel.find();
  }

  findAllStream(): JSON2CSVTransform<string> {
    const csvTransformer = new Transform({
      fields: ['_id', 'title', 'description', 'author.name'],
    });
    return this.bookModel
      .find()
      .lean()
      .cursor()
      .map((book) => JSON.stringify(book))
      .pipe(csvTransformer);
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (book) return book;
    throw new BookNotFoundException();
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, {
      new: true,
    });
    if (book) return book;
    throw new BookNotFoundException();
  }

  async remove(id: string): Promise<Book> {
    const book = await this.bookModel.findByIdAndRemove(id);
    if (book) return book;
    throw new BookNotFoundException();
  }
}
