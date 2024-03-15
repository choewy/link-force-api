import { SocketEventName, useSocketConnect, useSocketEvent } from '@core';
import { SocketExceptionDto } from '@implements';
import { useInitPlaySetting } from '@stores';

export default function AlertWidget() {
  useSocketConnect();
  useSocketEvent(SocketEventName.Connect, null, () => console.log('connected'));
  useSocketEvent(SocketEventName.ConnectAck, null, useInitPlaySetting());
  useSocketEvent(SocketEventName.Error, Error, (error) => console.log('error', error));
  useSocketEvent(SocketEventName.Exception, SocketExceptionDto, (exception) => console.log('exception', exception));
  useSocketEvent(SocketEventName.Disconnect, null, () => console.log('disconnected'));

  return <div>Alert Widget</div>;
}
