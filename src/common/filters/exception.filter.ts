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

  catch(e: HttpException | Error, host: ArgumentsHost): void {
    let exception: HttpException;

    switch (true) {
      case e instanceof HttpException:
        exception = e;
        break;

      default:
        exception = new InternalServerErrorException();
        exception.cause = {
          name: e.name,
          message: e.message,
        };
    }

    host
      .switchToHttp()
      .getResponse<Response>()
      .status(exception.getStatus())
      .send(ResponseEntityDTO.ofError(this.contextService.getRequestId(), this.contextService.getRequestDateTime(), exception.getResponse(), exception.cause));
  }
}
