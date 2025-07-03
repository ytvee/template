interface ConfigParams {
  userId?: number;
  token?: string;
  address?: string;
  connectionUrl?: string;
}

export class WebSocketConnectionConfig {
  private userId: number | undefined;
  private token: string | undefined;
  private address: string | undefined;
  private connectionUrl: string | undefined;

  constructor(
    params: ConfigParams = {
      userId: 0,
      token: "",
      address: "",
      connectionUrl: "",
    }
  ) {
    this.userId = params.userId;
    this.token = params.token;
    this.address = params.address;
    this.connectionUrl = params.connectionUrl;
  }

  public setUserId(userId: number): void {
    this.userId = userId;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public setAddress(address: string): void {
    this.address = address;
  }

  public setConnectionUrl(connectionUrl: string): void {
    this.connectionUrl = connectionUrl;
  }

  public getUserId() {
    return this.userId;
  }

  public getToken() {
    return this.token;
  }

  public getAddress() {
    return this.address;
  }

  public getConnectionUrl() {
    return this.connectionUrl;
  }
}
