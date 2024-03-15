import { SocketEventHandler } from '@core';
import { PlaySettingDto } from '@implements';
import { useCallback } from 'react';
import { atom, useSetRecoilState } from 'recoil';

export const playSettingStore = atom<PlaySettingDto | null>({
  key: 'play-setting-store',
  default: null,
});

export const useSetPlaySetting = (): SocketEventHandler<PlaySettingDto> => {
  const setPlaySetting = useSetRecoilState(playSettingStore);

  return useCallback((playSetting) => {
    setPlaySetting(playSetting);
  }, []);
};
