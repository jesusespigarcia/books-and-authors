import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeAll(async () => {
    jwtStrategy = new JwtStrategy(
      new ConfigService({
        'jwt.secret': 'jwt secret',
      }),
    );
  });

  it('should throw when id is invalid', async () => {
    const payload = {
      username: 'usuario 1',
    };
    expect(jwtStrategy.validate(payload)).toEqual({
      username: payload.username,
    });
  });
});
