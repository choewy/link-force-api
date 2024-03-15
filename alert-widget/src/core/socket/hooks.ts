import { useEffect } from 'react';

import { SocketEvent } from './events';
import { socket } from './socket';
import { SocketEventHandler } from './types';

export function useSocketEvent<T>(on: string, handler: SocketEventHandler<T>) {
  const eventName = ['socket', on].join('_');

  useEffect(() => {
    socket.on(on, (payload) => {
      if (Array.isArray(payload)) {
        new SocketEvent(eventName, ...payload).dispatch();
      } else {
        new SocketEvent(eventName, payload).dispatch();
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener(eventName, (e: Event) => handler((e as SocketEvent<T>).detail));
  }, []);
}
