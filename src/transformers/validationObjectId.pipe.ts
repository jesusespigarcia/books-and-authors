import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidationObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    console.log(`validation id pipe = ${value}`);
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException('Invalid ID');
    }

    return value;
  }
}
