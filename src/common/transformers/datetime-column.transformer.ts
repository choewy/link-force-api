import { ValueTransformer } from 'typeorm';
import { DateTime } from 'luxon';

export class DateTimeColumnTransformer implements ValueTransformer {
  from(value: Date | string | null): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    let datetime: DateTime | null = null;

    switch (true) {
      case value instanceof Date:
        datetime = DateTime.fromJSDate(value);
        break;

      case typeof value === 'string':
        datetime = DateTime.fromISO(value);
        break;
    }

    if (datetime === null) {
      return null;
    }

    if (!datetime.isValid) {
      return null;
    }

    return datetime.toISO({ includeOffset: true });
  }

  to(value: DateTime | Date | string | null): Date | null | undefined {
    if (value == null) {
      return value;
    }

    let date: Date | null = null;

    switch (true) {
      case value instanceof DateTime:
        date = value.toJSDate();
        break;

      case value instanceof Date:
        date = value;
        break;

      case typeof value === 'string':
        date = new Date(value);
        break;
    }

    if (date === null) {
      return null;
    }

    return date;
  }
}
