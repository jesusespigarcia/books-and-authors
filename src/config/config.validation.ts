import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsString()
  JWT_SECRET = 'jwt secret';

  @IsString()
  LOGIN_USER = 'admin';

  @IsString()
  LOGIN_PASSWORD = 'adminPwd';

  @IsString()
  DB_CONNECTION_URI = 'mongodb://localhost:27017/booksAndAuthors';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`You must pass environment variable ${errors[0].property}`);
  }
  return validatedConfig;
}
