import { UpdateBookDto } from '../books/dto/update-book.dto';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidationBookDtoPipe
  implements PipeTransform<UpdateBookDto, UpdateBookDto>
{
  transform(updateBookDto: UpdateBookDto): UpdateBookDto {
    if (updateBookDto.author) {
      if (!Types.ObjectId.isValid(updateBookDto.author)) {
        throw new BadRequestException('Invalid ID');
      }
    }
    return updateBookDto;
  }
}
