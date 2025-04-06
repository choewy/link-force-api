import { Injectable } from '@nestjs/common';

import { Params } from 'nestjs-pino';

@Injectable()
export class LoggerConfigFactory {
  public getPinoLoggerConfig(): Params {
    return {
      pinoHttp: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            useLevelLabels: true,
            json: true,
          },
        },
        redact: {
          remove: true,
          paths: [
            'req.remoteAddress',
            'req.remotePort',
            'req.headers["x-powered-by"]',
            'req.headers["vary"]',
            'req.headers["etag"]',
            'req.headers["sec-ch-ua"]',
            'req.headers["sec-ch-ua-mobile"]',
            'req.headers["sec-ch-ua-platform"]',
            'req.headers["sec-fetch-site"]',
            'req.headers["sec-fetch-mode"]',
            'req.headers["sec-fetch-dest"]',
            'res.headers["accept"]',
            'req.headers["accept-encoding"]',
            'req.headers["accept-language"]',
            'req.headers["cookie"]',
            'req.headers["if-none-match"]',
            'res.headers["x-powered-by"]',
            'res.headers["vary"]',
            'res.headers["etag"]',
          ],
        },
      },
    };
  }
}
