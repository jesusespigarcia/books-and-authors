import { AuthorNotFoundException } from './exceptions/authorNotFoundException';
import { Transform } from 'json2csv';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author, AuthorDocument } from './schemas/author.schema';
import JSON2CSVTransform from 'json2csv/JSON2CSVTransform';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return await this.authorModel.create(createAuthorDto);
  }

  async findAll(): Promise<Author[]> {
    return await this.authorModel.find();
  }

  findAllStream(): JSON2CSVTransform<string> {
    const csvTransformer = new Transform();
    return this.authorModel
      .find()
      .lean()
      .cursor()
      .map((author) => JSON.stringify(author))
      .pipe(csvTransformer);
  }

  async findOne(id: string): Promise<Author> {
    const author = await this.authorModel.findById(id);
    if (author) return author;
    throw new AuthorNotFoundException();
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorModel.findByIdAndUpdate(
      id,
      updateAuthorDto,
      {
        new: true,
      },
    );
    if (author) return author;
    throw new AuthorNotFoundException();
  }

  async remove(id: string): Promise<Author> {
    const author = await this.authorModel.findByIdAndRemove(id);
    if (author) return author;
    throw new AuthorNotFoundException();
  }
}
