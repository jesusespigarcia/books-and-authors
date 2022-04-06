import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthorNotFoundException extends HttpException {
  constructor() {
    super(`Author don't exists`, HttpStatus.NOT_FOUND);
  }
}
