import { BadRequestException, ValidationError } from '@nestjs/common';

import { AxiosError } from 'axios';

export class ValidationFailedException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    super();

    this.cause = {
      name: 'ValidationFailedError',
      data: errors.shift()?.constraints,
    };
  }
}

export class AxiosErrorException extends BadRequestException {
  constructor(error: AxiosError, name: string) {
    super();

    this.cause = {
      name,
      data: error.response?.data,
    };
  }
}
