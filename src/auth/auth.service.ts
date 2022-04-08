import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const loginUser = this.configService.get<string>('login.user');
    const loginPassword = this.configService.get<string>('login.password');
    if (username === loginUser && password === loginPassword) {
      return {
        username,
      };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
