import { SocketEventHandler, SocketPubEvent, socket } from '@core';
import { PlayCompleteCommand, PlaySettingDto, PlayTargetDto } from '@implements';
import { useCallback, useEffect } from 'react';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';

export enum PlayTargetStatus {
  None = 0,
  Setup = 1,
  Playing = 2,
  Teardown = 3,
}

export type PlayTagetLoading = {
  message: boolean | null;
  image: boolean | null;
};

export type PlayTargetStoreProps = {
  status: PlayTargetStatus;
  target: PlayTargetDto | null;
  loading: PlayTagetLoading;
};

export const playTargetStore = atom<PlayTargetStoreProps>({
  key: 'play-target-store',
  default: {
    status: PlayTargetStatus.None,
    target: null,
    loading: { message: null, image: null },
  },
});

export const useSetPlayTarget = (): SocketEventHandler<PlayTargetDto> => {
  const setPlayTarget = useSetRecoilState(playTargetStore);

  return useCallback((playTarget) => {
    setPlayTarget({
      status: PlayTargetStatus.Setup,
      target: playTarget,
      loading: {
        message: playTarget?.message == null ? null : false,
        image: playTarget?.imageUrl == null ? null : false,
      },
    });
  }, []);
};

export const useClearPlayTarget = (): SocketEventHandler<void> => {
  const setPlayTarget = useSetRecoilState(playTargetStore);

  return useCallback(() => {
    setPlayTarget({
      status: PlayTargetStatus.None,
      target: null,
      loading: {
        message: null,
        image: null,
      },
    });
  }, []);
};

export const usePlayTargetLoading = () => {
  const [playTarget, setPlayTarget] = useRecoilState(playTargetStore);

  useEffect(() => {
    if ([PlayTargetStatus.Setup].includes(playTarget.status) === false) {
      return;
    }

    if (playTarget.loading.message === false) {
      return;
    }

    if (playTarget.loading.image === false) {
      return;
    }

    setPlayTarget((prev) => ({ ...prev, status: PlayTargetStatus.Playing }));
  }, [playTarget.status, playTarget.loading]);
};

export const usePlayTargetTimer = (playSetting: PlaySettingDto | null) => {
  const maxSeconds = playSetting?.maxSeconds ?? null;
  const delay = playSetting?.delay ?? null;

  const [playTarget, setPlayTarget] = useRecoilState(playTargetStore);

  useEffect(() => {
    if (maxSeconds === null || delay === null) {
      return;
    }

    if (playTarget.status === PlayTargetStatus.Playing) {
      const timeout = setTimeout(() => {
        setPlayTarget((prev) => ({ ...prev, status: PlayTargetStatus.Teardown }));
      }, maxSeconds * 1000);

      return () => {
        clearTimeout(timeout);
      };
    }

    if (playTarget.status === PlayTargetStatus.Teardown) {
      const timeout = setTimeout(
        () => {
          if (playTarget.target?.id == null) {
            return;
          }

          socket.emit(SocketPubEvent.PlayComplete, new PlayCompleteCommand(playTarget.target.id));
        },
        (1 + delay) * 1000,
      );

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [maxSeconds, delay, playTarget.target, playTarget.status]);
};
