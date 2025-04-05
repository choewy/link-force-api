export enum MetadataKey {
  SetOptionalRequestUserID = 'set-optional-request-user-id',
}

export enum RequestHeader {
  AccessToken = 'authorization',
  RefreshToken = 'x-refresh-token',
  XforwardedFor = 'x-forwarded-for',
  Useragent = 'user-agent',
  Referer = 'referer',
}

export enum ResponseHeader {
  AccessToken = 'x-access-token',
  RefreshToken = 'x-refresh-token',
}
