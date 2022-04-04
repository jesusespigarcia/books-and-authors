import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author, AuthorDocument } from './schemas/author.schema';

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

  async findOne(id: string): Promise<Author> {
    return await this.authorModel.findById(id);
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    return await this.authorModel.findByIdAndUpdate(id, updateAuthorDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<Author> {
    return await this.authorModel.findByIdAndRemove(id);
  }
}
