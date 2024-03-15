import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';

import { Type } from './types';

export const toInstance = <T>(Cls: Type<T>, plainObject?: object) => {
  if (plainObject) {
    return plainToInstance(Cls, plainObject, {
      enableCircularCheck: true,
      enableImplicitConversion: true,
    });
  } else {
    return null;
  }
};
