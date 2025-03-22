import { SignPlatform } from '../user/persistents/enums';

export type GetOrCreatePlatformAccountParam = {
  platform: SignPlatform;
  accountId: string;
  name?: string | null;
  nickname?: string | null;
  email?: string | null;
  profileImage?: string | null;
};
