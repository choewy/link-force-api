import { toInstance } from '@common';
import { socket } from '@core';
import { PlaySettingDto } from '@implements';
import { useCallback } from 'react';
import { atom, useSetRecoilState } from 'recoil';

export const playSettingStore = atom<PlaySettingDto | null>({
  key: 'play-setting-store',
  default: null,
});

export const useInitPlaySetting = () => {
  const setPlaySetting = useSetRecoilState(playSettingStore);

  return useCallback(async () => {
    const ack = await socket.emitWithAck('setting', 'asdf');

    if (ack) {
      setPlaySetting(toInstance(PlaySettingDto, ack));
    }
  }, [setPlaySetting]);
};
