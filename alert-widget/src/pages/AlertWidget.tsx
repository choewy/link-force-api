import { socket, useSocketEvent } from '@core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function AlertWidget() {
  const params = useParams();
  const id = params.id ?? null;

  useEffect(() => {
    if (id === null) {
      return;
    }

    socket.auth = { id, type: 'alert' };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [id]);

  useSocketEvent('connect', () => console.log('connected'));
  useSocketEvent('error', (error) => console.log('error', error));
  useSocketEvent('disconnect', () => console.log('disconnected'));

  return <div>Alert Widget</div>;
}
