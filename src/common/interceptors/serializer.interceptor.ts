import { CallHandler, ClassSerializerInterceptor, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { map } from 'rxjs';

import { ResponseEntityDTO } from 'src/persistent/dtos';

import { ContextService } from '../context/context.service';

@Injectable()
export class SerializerInterceptor extends ClassSerializerInterceptor {
  constructor(
    reflector: Reflector,
    private readonly contextService: ContextService,
  ) {
    super(reflector, {
      enableCircularCheck: true,
      enableImplicitConversion: true,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    return super.intercept(context, next).pipe(map((data) => ResponseEntityDTO.ofData(this.contextService.getRequestId(), this.contextService.getRequestDateTime(), data)));
  }
}
