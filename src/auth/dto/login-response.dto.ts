import { IsNotEmpty, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
