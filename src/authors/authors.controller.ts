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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './schemas/author.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Autor creado',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales incorrectas',
  })
  @ApiOperation({
    summary: 'creación de un autor',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return await this.authorsService.create(createAuthorDto);
  }

  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiOperation({
    summary: 'consulta de los autores',
  })
  @Get()
  async findAll(): Promise<Author[]> {
    return await this.authorsService.findAll();
  }

  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiNotFoundResponse({
    description: 'Autor no encontrado',
  })
  @ApiOperation({
    summary: 'consulta de un autor',
  })
  @Get(':id')
  async findOne(
    @Param('id', new ValidationObjectIdPipe()) id: string,
  ): Promise<Author> {
    return await this.authorsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiNotFoundResponse({
    description: 'Autor no encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales incorrectas',
  })
  @ApiOperation({
    summary: 'actualización de un autor',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', new ValidationObjectIdPipe()) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return await this.authorsService.update(id, updateAuthorDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiNotFoundResponse({
    description: 'Autor no encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales incorrectas',
  })
  @ApiOperation({
    summary: 'borrado de un autor',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ValidationObjectIdPipe()) id: string,
  ): Promise<Author> {
    return await this.authorsService.remove(id);
  }

  @ApiOkResponse({
    description: 'Operación correcta',
  })
  @ApiOperation({
    summary: 'listado de autores en formato csv',
  })
  @Get('files/csv')
  getCsv(@Response({ passthrough: true }) res): StreamableFile {
    res.set({
      'Content-Type': 'application/CSV',
      'Content-Disposition': 'attachment; filename="authors.csv"',
    });
    return new StreamableFile(this.authorsService.findAllStream());
  }
}
