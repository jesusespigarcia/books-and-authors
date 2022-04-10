import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { validate } from '../config/config.validation';
import configuration from '../config/configuration';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should validate when user and password are correct', () => {
    expect.assertions(3);
    const loginUser = {
      username: 'user 1',
      password: 'password1',
    };
    const req = {
      user: {
        username: 'user 1',
      },
    };
    const tokenReturned = {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjQ5NDM2NTMzLCJleHAiOjE2NDk0MzY1OTN9.YUJEfDiY9w97Txf0Z7H88Fl6SLo0vVpq3o6-7t7w43w',
    };
    const loginSpy = jest
      .spyOn(service, 'login')
      .mockReturnValueOnce(tokenReturned);
    const token = controller.login(loginUser, req);
    expect(loginSpy).toHaveBeenCalledTimes(1);
    expect(loginSpy.mock.calls[0][0]).toBe(req.user);
    expect(token).toEqual(tokenReturned);
  });
});
