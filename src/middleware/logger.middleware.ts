import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const { method, originalUrl, body } = req;
      const { statusCode, statusMessage } = res;
      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;
      if (statusCode >= 500) {
        this.logger.error(message);
      }
      if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
      this.logger.verbose(JSON.stringify(body));
    });
    next();
  }
}
