import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  validateUser(username: string, password: string) {
    const loginUser = this.configService.get<string>('login.user');
    const loginPassword = this.configService.get<string>('login.password');
    if (username === loginUser && password === loginPassword) {
      return {
        username,
      };
    }
    return null;
  }

  login(user) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
