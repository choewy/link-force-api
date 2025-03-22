import { BadRequestException, ValidationError } from '@nestjs/common';

import { AxiosError } from 'axios';

export class ValidationFailedException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    super();
    this.name = 'ValidationFailedError';
    this.cause = errors.shift()?.constraints;
  }
}

export class AxiosErrorException extends BadRequestException {
  constructor(error: AxiosError, name: string) {
    super();
    this.name = name;
    this.cause = error.response?.data;
  }
}
