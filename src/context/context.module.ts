import { Global, Module } from '@nestjs/common';

import { ClsModule } from 'nestjs-cls';
import { Request, Response } from 'express';
import { v4 } from 'uuid';

import { ContextKey } from './constants';
import { ContextService } from './context.service';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup(clsService, req: Request, res: Response) {
          const requestId = req.get(ContextKey.RequestID) ?? v4();
          const requestTimestamp = Date.now();

          req['id'] = requestId;
          res.set(ContextKey.RequestID, requestId);

          clsService.set(ContextKey.RequestID, requestId);
          clsService.set(ContextKey.RequestTimestamp, requestTimestamp);
        },
      },
    }),
  ],
  providers: [ContextService],
  exports: [ContextService],
})
export class ContextModule {}
