export class NodeEnv {
  constructor(private readonly env: string) {}

  public getValue() {
    return this.env;
  }

  public isLocal() {
    return this.env === 'local';
  }

  public isDevelopment() {
    return this.env === 'development';
  }

  public isProduction() {
    return this.env === 'production';
  }
}
