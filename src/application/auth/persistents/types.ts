import { JwtPayload } from 'jsonwebtoken';

export type AccessTokenPayload = JwtPayload & { id: string };

export type RefreshTokenPayload = JwtPayload & { signature: string };

export type VerifyAccessTokenResult = {
  id: string | null;
  platformAccountId: string | null;
  isExpired: boolean;
};

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};
