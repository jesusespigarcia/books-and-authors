import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Error } from 'mongoose';

@Catch(Error.ValidationError, Error.CastError)
export class MongooseErrorFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(new HttpException('Invalid ID', HttpStatus.BAD_REQUEST), host);
  }
}
