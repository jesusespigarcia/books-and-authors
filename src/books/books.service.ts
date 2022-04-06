import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return await await this.bookModel.create(createBookDto);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookModel.find();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (book) return book;
    throw new NotFoundException();
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, {
      new: true,
    });
    if (book) return book;
    throw new NotFoundException();
  }

  async remove(id: string): Promise<Book> {
    const book = await this.bookModel.findByIdAndRemove(id);
    if (book) return book;
    throw new NotFoundException();
  }
}
