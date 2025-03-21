import { BadRequestException, Injectable, ValidationPipe as NestValidationPipe } from '@nestjs/common';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableCircularCheck: true,
        enableImplicitConversion: true,
      },
      exceptionFactory(errors) {
        const error = errors.shift();
        const constraints = error?.constraints ?? {};
        const message = Object.values(constraints).shift() ?? '';

        throw new BadRequestException(message);
      },
    });
  }
}
