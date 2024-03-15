import AlertComment from '@components/AlertComment';
import AlertImage from '@components/AlertImage';
import AlertMessage from '@components/AlertMessage';
import { SocketSubEvent, useSocketConnect, useSocketEvent } from '@core';
import { PlaySettingDto, PlayTargetDto, SocketExceptionDto } from '@implements';
import {
  playSettingStore,
  playTargetStore,
  useClearPlayTarget,
  usePlayTargetLoading,
  usePlayTargetTimer,
  useSetPlaySetting,
  useSetPlayTarget,
} from '@stores';
import { useRecoilValue } from 'recoil';

export default function AlertWidget() {
  const playSetting = useRecoilValue(playSettingStore);
  const playTarget = useRecoilValue(playTargetStore);

  usePlayTargetLoading();
  usePlayTargetTimer(playSetting);

  useSocketConnect();
  useSocketEvent(SocketSubEvent.Connect, null, () => console.log('connected'));
  useSocketEvent(SocketSubEvent.Error, Error, (error) => console.log('error', error));
  useSocketEvent(SocketSubEvent.Exception, SocketExceptionDto, (exception) => console.log('exception', exception));
  useSocketEvent(SocketSubEvent.Disconnect, null, () => console.log('disconnected'));
  useSocketEvent(SocketSubEvent.Setting, PlaySettingDto, useSetPlaySetting());
  useSocketEvent(SocketSubEvent.Play, PlayTargetDto, useSetPlayTarget());
  useSocketEvent(SocketSubEvent.Clear, PlayTargetDto, useClearPlayTarget());

  return (
    <div>
      <AlertComment playTarget={playTarget} />
      <AlertMessage playTarget={playTarget} />
      <AlertImage playTarget={playTarget} />
    </div>
  );
}
