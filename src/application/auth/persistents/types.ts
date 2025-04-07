import { JwtPayload } from 'jsonwebtoken';

export type AccessTokenPayload = JwtPayload & { id: string };

export type RefreshTokenPayload = JwtPayload & { segment: string };

export type VerifyAccessTokenResult = {
  id: string | null;
  platformAccountId: string | null;
  isExpired: boolean;
};
