import { IEvent } from '@common';

export class SocketEvent<T> extends IEvent<T> {
  constructor(eventName: string, detail?: T) {
    super(eventName, { detail });
  }
}
