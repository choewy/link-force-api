import { plainToInstance } from 'class-transformer';

export class OAuthCallbackState {
  constructor(
    readonly redirectUrl: string,
    readonly linkId: string | null,
    readonly userId: string | null,
  ) {}

  public toString(): string {
    return Buffer.from(JSON.stringify(this), 'utf-8').toString('base64');
  }

  public static from(state: string): OAuthCallbackState {
    return plainToInstance(this, JSON.parse(Buffer.from(state, 'base64').toString('utf-8')));
  }
}
