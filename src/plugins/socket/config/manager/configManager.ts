import { WebSocketNotificationsConfig } from "../../instance/instance";
import { WebSocketConnectionConfig } from "../config";
import { isFalsy } from "utility-types";

class typeDependendManager {
  public static isValid<T>(data: T): boolean {
    return !isFalsy(data);
  }
}

export class ConfigManager {
  public static isUserIdValid(id: number | undefined): boolean {
    const validityStatus = typeDependendManager.isValid(id);
    return validityStatus;
  }
  public static isTokenValid(token: string | undefined): boolean {
    const validityStatus = typeDependendManager.isValid(token);
    return validityStatus;
  }
  public static isAddressValid(address: string | undefined): boolean {
    const validityStatus = typeDependendManager.isValid(address);
    return validityStatus;
  }
  public static isConnectionUrlValid(connectionUrl: string | undefined): boolean {
    const validityStatus = typeDependendManager.isValid(connectionUrl);
    return validityStatus;
  }

  public static isConfigValid(config: WebSocketConnectionConfig | null): boolean {
    if (!config) {
      return false;
    }
    return this.isUserIdValid(config.getUserId()) && this.isTokenValid(config.getToken()) && this.isAddressValid(config.getAddress()) && this.isConnectionUrlValid(config.getConnectionUrl());
  }

  public static createConnectionUrl(token: string, address: string): string {
    if (!(this.isAddressValid(address) && this.isTokenValid(token))) {
      return "";
    }
    return address + "?Authorization=" + token;
  }

  public static createConfig(instanceConfiguration: WebSocketNotificationsConfig): WebSocketConnectionConfig {
    const address = this.getWebSocketAddress();
    const connectionUrl = this.createConnectionUrl(instanceConfiguration.token, address);
    const config = new WebSocketConnectionConfig({
      token: instanceConfiguration.token,
      userId: instanceConfiguration.userId,
      address: address,
      connectionUrl: connectionUrl,
    });
    return config;
  }

  private static getWebSocketAddress(): string {
    const { VUE_APP_SOCKET_NOTIFICATIONS_URL } = process.env;
    if (!VUE_APP_SOCKET_NOTIFICATIONS_URL) {
      throw new Error("No WebSocket BASE_URL provided");
    }
    return VUE_APP_SOCKET_NOTIFICATIONS_URL;
  }
}
