import { LoginResponseDto } from './dto/login-response.dto';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiExtraModels(LoginResponseDto)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @ApiBadRequestResponse({
    description: 'Credenciales incorrectas',
  })
  @ApiOkResponse({
    description: 'Login correcto'
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'login mediante usuario y password',
  })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Request() req): LoginResponseDto {
    return this.authService.login(req.user);
  }
}
