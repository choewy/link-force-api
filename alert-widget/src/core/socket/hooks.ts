import { Type, toInstance } from '@common';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { SocketEvent } from './events';
import { socket } from './socket';
import { SocketEventHandler } from './types';

export function useSocketConnect() {
  const params = useParams();
  const id = params.id ?? null;

  useEffect(() => {
    if (id) {
      socket.auth = { id, type: 'alert' };
      socket.connect();

      return () => {
        socket.disconnect();
      };
    }
  }, [id]);
}

export function useSocketEvent<T>(onEventName: string, Cls: Type<T> | null | undefined, handler: SocketEventHandler<T>) {
  const eventName = ['socket', onEventName].join('_');

  useEffect(() => {
    socket.on(onEventName, (value) => {
      if (Cls && value) {
        value = toInstance(Cls, value);
      }

      new SocketEvent(eventName, value).dispatch();
    });
  }, []);

  useEffect(() => {
    window.addEventListener(eventName, (e: Event) => handler((e as SocketEvent<T>).detail));
  }, []);
}
