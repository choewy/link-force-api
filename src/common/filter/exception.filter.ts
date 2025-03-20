import { ArgumentsHost, Catch, HttpException, InternalServerErrorException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { Response } from 'express';

import { ResponseEntityDTO } from 'src/persistent/dtos';

import { ContextService } from '../context/context.service';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly contextService: ContextService) {
    super();
  }

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    let e: HttpException;

    switch (true) {
      case exception instanceof HttpException:
        e = exception;
        break;

      default:
        e = new InternalServerErrorException();
        e = new InternalServerErrorException({
          message: e.message,
          statusCode: e.getStatus(),
          cause: {
            name: exception.name,
            message: exception.message,
          },
        });
    }

    host
      .switchToHttp()
      .getResponse<Response>()
      .status(e.getStatus())
      .send(ResponseEntityDTO.ofError(this.contextService.getRequestId(), this.contextService.getRequestDateTime(), e.getResponse()));
  }
}
