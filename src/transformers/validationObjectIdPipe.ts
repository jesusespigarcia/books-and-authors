import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidationObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const validObjectId = Types.ObjectId.isValid(value);

    if (validObjectId) return value;
    throw new BadRequestException('Invalid ID');
  }
}
