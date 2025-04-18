import { plainToInstance } from 'class-transformer';

export class OAuthCallbackState {
  constructor(
    readonly redirectUrl: string,
    readonly linkId: string | null,
    readonly userId: string | null,
  ) {}

  public toString(): string {
    return JSON.stringify(this);
  }

  public static from(state: string): OAuthCallbackState {
    return plainToInstance(this, JSON.parse(state));
  }
}
