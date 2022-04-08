import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthorNotFoundException extends HttpException {
  constructor() {
    super(`Author doesn't exists`, HttpStatus.NOT_FOUND);
  }
}
