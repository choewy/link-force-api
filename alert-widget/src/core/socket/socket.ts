import { STREAM_WS_URL } from '@common';
import { Manager, Socket } from 'socket.io-client';

export const socket = new Socket(
  new Manager(STREAM_WS_URL, {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true,
  }),
  '/widget',
);
