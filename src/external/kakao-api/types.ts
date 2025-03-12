export type KakaoLoginURLRequestParam = {
  response_type: 'code';
  client_id: string;
  redirect_uri: string;
  state: string;
};

export type KakaoLoginCallbackParam = {
  code: string;
  state: string;
  error?: string;
  error_description?: string;
};

export type KakaoTokenRequestParam = {
  grant_type: 'authorization_code';
  client_id: string;
  redirect_uri: string;
  client_secret?: string;
  code: string;
};

export type KakaoTokenResponse = {
  token_type: 'bearer';
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
  id_token?: string;
};

export type KakaoProfileResponse = {
  id: string;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
      is_default_nickname: boolean;
    };
  };
};
