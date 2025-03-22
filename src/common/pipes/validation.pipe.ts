import { Injectable, ValidationPipe as NestValidationPipe } from '@nestjs/common';

import { ValidationFailedException } from 'src/persistent/exceptions';

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
        throw new ValidationFailedException(errors);
      },
    });
  }
}
