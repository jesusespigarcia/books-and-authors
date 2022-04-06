import { ValidationObjectIdPipe } from '../transformers/validationObjectIdPipe';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return await this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(): Promise<Book[]> {
    return await this.booksService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ValidationObjectIdPipe()) id: string,
  ): Promise<Book> {
    return await this.booksService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ValidationObjectIdPipe()) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return await this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ValidationObjectIdPipe()) id: string,
  ): Promise<Book> {
    return await this.booksService.remove(id);
  }
}
