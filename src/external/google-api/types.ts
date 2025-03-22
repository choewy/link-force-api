export type GoogleLoginURLRequestParam = {
  response_type: 'code';
  scope: string;
  client_id: string;
  redirect_uri: string;
  state: string;
};

export type GoogleLoginCallbackParam = {
  code: string;
  state: string;
  error?: string;
};

export type GoogleTokenRequestParam = {
  grant_type: 'authorization_code';
  client_id: string;
  client_secret: string;
  code: string;
};

export type GoogleTokenResponse = {
  token_type: 'Bearer';
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  error?: string;
};

export type GoogleProfileResponse = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};
