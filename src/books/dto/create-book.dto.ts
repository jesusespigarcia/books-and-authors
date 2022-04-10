import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  description: string;

  @IsNotEmpty()
  @IsString()
  author: string;
}
