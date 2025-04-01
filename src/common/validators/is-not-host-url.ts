import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { v4 } from 'uuid';

@ValidatorConstraint({ name: 'isNotHostUrl', async: false })
export class IsNotHostUrlConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value) {
      return false;
    }

    return value.includes(process.env.HOST ?? v4());
  }

  defaultMessage(): string {
    return 'url is host url';
  }
}

export function IsNotHostUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotHostUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotHostUrlConstraint,
    });
  };
}
