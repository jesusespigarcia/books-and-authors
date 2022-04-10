import { HttpException, HttpStatus } from '@nestjs/common';

export class BookNotFoundException extends HttpException {
  constructor() {
    super(`Book doesn't exists`, HttpStatus.NOT_FOUND);
  }
}
