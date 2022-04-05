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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
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
  async findAll(): Promise<Author[]> {
    return await this.authorsService.findAll();
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
