import { LocalStrategy } from './local.strategy';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { validate } from '../../config/config.validation';
import configuration from '../../config/configuration';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let authService: AuthService;
  let localStrategy: LocalStrategy;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          validate,
        }),
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    localStrategy = new LocalStrategy(authService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate when user and password are correct', () => {
    expect.assertions(4);
    const user1 = { username: 'username 1', password: 'password1' };
    const userReturned = { username: user1.username };
    const validateUserSpy = jest
      .spyOn(authService, 'validateUser')
      .mockReturnValueOnce(userReturned);
    const user = localStrategy.validate(user1.username, user1.password);
    expect(validateUserSpy).toHaveBeenCalledTimes(1);
    expect(validateUserSpy.mock.calls[0][0]).toBe(user1.username);
    expect(validateUserSpy.mock.calls[0][1]).toBe(user1.password);
    expect(user).toEqual(userReturned);
  });

  it('should throw when user or password are incorrect', () => {
    expect.assertions(4);
    const user1 = { username: 'username 1', password: 'password1' };
    const userReturned = null;
    const validateUserSpy = jest
      .spyOn(authService, 'validateUser')
      .mockReturnValueOnce(userReturned);
    expect(() =>
      localStrategy.validate(user1.username, user1.password),
    ).toThrow(UnauthorizedException);
    expect(validateUserSpy).toHaveBeenCalledTimes(1);
    expect(validateUserSpy.mock.calls[0][0]).toBe(user1.username);
    expect(validateUserSpy.mock.calls[0][1]).toBe(user1.password);
  });
});
