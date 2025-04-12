import { applyDecorators, CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request, Response } from 'express';

import { MetadataKey, RequestHeader, ResponseHeader } from 'src/persistent/enums';
import { ContextService } from 'src/common/context/context.service';

import { AuthService } from './auth.service';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const optionalRequestUserID = this.reflector.getAllAndOverride<boolean>(MetadataKey.SetOptionalRequestUserID, [context.getClass(), context.getHandler()]);

    const http = context.switchToHttp();

    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const accessToken = (request.headers[RequestHeader.AccessToken] ?? '').replace('Bearer ', '');
    const refreshToken =
      (Array.isArray(request.headers[RequestHeader.RefreshToken]) ? request.headers[RequestHeader.RefreshToken].shift() : request.headers[RequestHeader.RefreshToken]) ?? '';

    const { id, platform, accountId, isExpired } = this.authService.verifyAccessToken(accessToken);

    this.contextService.setRequestUserID(id);
    this.contextService.setRequestOAuthKey(platform, accountId);

    if ((!id || !platform || !accountId) && !optionalRequestUserID) {
      throw new UnauthorizedException();
    }

    if (id && platform && accountId && isExpired) {
      if (!this.authService.verifyRefreshToken(refreshToken, accessToken)) {
        throw new UnauthorizedException();
      }

      const reIssuedAccessToken = this.authService.issueAccessToken(id, platform, accountId);
      const reIssuedRefreshToken = this.authService.issueRefreshToken(reIssuedAccessToken);

      response.setHeader(ResponseHeader.AccessToken, reIssuedAccessToken);
      response.setHeader(ResponseHeader.RefreshToken, reIssuedRefreshToken);
    }

    return true;
  }
}

export const UseAuthGuard = () => applyDecorators(UseGuards(AuthGuard), ApiBearerAuth(RequestHeader.AccessToken), ApiBasicAuth(RequestHeader.RefreshToken));
