import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { validate } from '../config/config.validation';
import configuration from '../config/configuration';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          validate,
        }),
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user when user and password are correct', () => {
    expect.assertions(1);
    const username = configService.get<string>('login.user');
    const password = configService.get<string>('login.password');
    const user = {
      username: username,
    };
    expect(service.validateUser(username, password)).toEqual(user);
  });

  it('should return null when user or password are incorrect', () => {
    expect.assertions(2);
    const username = configService.get<string>('login.user');
    const password = configService.get<string>('login.password');
    expect(service.validateUser(`${username}xxx`, password)).toEqual(null);
    expect(service.validateUser(username, `${password}xxx`)).toEqual(null);
  });

  it('should validate when user and password are correct', () => {
    expect.assertions(3);
    const tokenReturned = {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjQ5NDM2NTMzLCJleHAiOjE2NDk0MzY1OTN9.YUJEfDiY9w97Txf0Z7H88Fl6SLo0vVpq3o6-7t7w43w',
    };
    const user = {
      username: 'user 1',
    };
    const signPayload = {
      username: user.username,
    };
    const signSpy = jest
      .spyOn(jwtService, 'sign')
      .mockReturnValueOnce(tokenReturned.accessToken);
    const accessToken = service.login(user);
    expect(signSpy).toHaveBeenCalledTimes(1);
    expect(signSpy.mock.calls[0][0]).toEqual(signPayload);
    expect(accessToken).toEqual(tokenReturned);
  });
});
