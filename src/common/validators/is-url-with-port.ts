import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isUrlWithPort', async: false })
export class IsUrlWithPortConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value) {
      return false;
    }

    return new RegExp('^((https|http):\\/\\/)([a-zA-Z0-9.-]+)(:[0-9]{1,5})?(\\/[^\\s]*)?$').test(value);
  }

  defaultMessage(): string {
    return 'url is not url';
  }
}

export function IsUrlWithPort(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUrlWithPort',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUrlWithPortConstraint,
    });
  };
}
