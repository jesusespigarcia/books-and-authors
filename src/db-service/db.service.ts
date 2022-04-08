import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class DbService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('db.connectionUri'),
    };
  }
}
