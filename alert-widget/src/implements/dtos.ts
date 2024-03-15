import { Type } from 'class-transformer';

export class SocketExceptionDto {
  name!: string;
  message!: string;
  cause?: object;
  error?: object;
}

export class PlaySettingDto {
  autoPlay!: boolean;
  alertVolume!: number;
  messageVolume!: number;
  @Type(() => Number)
  delay!: number;
  @Type(() => Number)
  maxSeconds!: number;
}

export class PlayTargetDto {
  id!: number;
  nickname!: string;
  amount!: number;
  message!: string | null;
  imageUrl!: string | null;
}
