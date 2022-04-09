import { ValidationObjectIdPipe } from '../transformers/validationObjectIdPipe';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  StreamableFile,
  Response,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MongooseErrorFilter } from '../filters/validation-exceptions.filter';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Libro creado',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales incorrectas',
  })
  @ApiOperation({
    summary: 'creación de un libro',
  })
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongooseErrorFilter)
  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return await this.booksService.create(createBookDto);
  }

  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiOperation({
    summary: 'consulta de los libros',
  })
  @Get()
  async findAll(): Promise<Book[]> {
    return await this.booksService.findAll();
  }

  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiNotFoundResponse({
    description: 'Libro no encontrado',
  })
  @ApiOperation({
    summary: 'consulta de un libro',
  })
  @Get(':id')
  async findOne(
    @Param('id', new ValidationObjectIdPipe()) id: string,
  ): Promise<Book> {
    return await this.booksService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiNotFoundResponse({
    description: 'Libro no encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales incorrectas',
  })
  @ApiOperation({
    summary: 'actualización de un libro',
  })
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongooseErrorFilter)
  @Patch(':id')
  async update(
    @Param('id', new ValidationObjectIdPipe()) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return await this.booksService.update(id, updateBookDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiNotFoundResponse({
    description: 'Libro no encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales incorrectas',
  })
  @ApiOperation({
    summary: 'borrado de un libro',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ValidationObjectIdPipe()) id: string,
  ): Promise<Book> {
    return await this.booksService.remove(id);
  }

  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiOperation({
    summary: 'listado de libros en formato csv',
  })
  @Get('files/csv')
  getCsv(@Response({ passthrough: true }) res): StreamableFile {
    res.set({
      'Content-Type': 'application/CSV',
      'Content-Disposition': 'attachment; filename="books.csv"',
    });
    return new StreamableFile(this.booksService.findAllStream());
  }
}
