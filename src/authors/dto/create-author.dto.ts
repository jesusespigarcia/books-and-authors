import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  age: number;
}
