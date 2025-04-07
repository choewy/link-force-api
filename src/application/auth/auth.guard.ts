import { applyDecorators, CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { MetadataKey, RequestHeader } from 'src/persistent/enums';
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

    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = (request.headers[RequestHeader.AccessToken] ?? '').replace('Bearer ', '');

    const { id, platformAccountId, isExpired } = this.authService.verifyAccessToken(accessToken);

    this.contextService.setRequestUserID(id);
    this.contextService.setRequestPlatformAccountID(platformAccountId);

    if ((!id || !platformAccountId) && !optionalRequestUserID) {
      throw new UnauthorizedException();
    }

    if (isExpired) {
      throw new UnauthorizedException('access token expired');
    }

    return true;
  }
}

export const UseAuthGuard = () => applyDecorators(UseGuards(AuthGuard), ApiBearerAuth(RequestHeader.AccessToken), ApiBasicAuth(RequestHeader.RefreshToken));
