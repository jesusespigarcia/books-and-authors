import { ValidationObjectIdPipe } from '../transformers/validationObjectId.pipe';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './schemas/author.schema';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return await this.authorsService.create(createAuthorDto);
  }

  @Get()
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Author[]> {
    return await this.authorsService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ValidationObjectIdPipe()) id: string,
  ): Promise<Author> {
    return await this.authorsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ValidationObjectIdPipe()) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return await this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ValidationObjectIdPipe()) id: string,
  ): Promise<Author> {
    return await this.authorsService.remove(id);
  }
}
