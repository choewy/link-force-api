export type NaverLoginURLRequestParam = {
  response_type: 'code';
  client_id: string;
  redirect_uri: string;
  state: string;
};

export type NaverLoginCallbackParam = {
  code: string;
  state: string;
  error?: string;
  error_description?: string;
};

export type NaverTokenRequestParam = {
  grant_type: 'authorization_code';
  client_id: string;
  client_secret: string;
  code: string;
  state: string;
};

export type NaverTokenResponse = {
  token_type: 'Bearer';
  access_token: string;
  refresh_token: string;
  expires_in: number;
  error?: string;
  error_message?: string;
};

export type NaverProfileResponse = {
  resultcode: string;
  message: string;
  response: {
    id: string;
    nickname: string;
    name: string;
    email: string;
    gender: string;
    profile_image: string;
    age: string;
    birthday: string;
    birthyear: string;
    mobile: string;
  };
};
