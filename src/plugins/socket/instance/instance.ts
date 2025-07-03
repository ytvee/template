import store from "@/store/store";
import { WebSocketConnectionConfig } from "../config/config";
import { ConfigManager } from "../config/manager/configManager";

export interface WebSocketNotificationsConfig {
  token: string;
  userId: number;
}

export interface SocketData {
  [index: string]: string;
}

export class SocketModule {
  private config: WebSocketConnectionConfig | null = null;
  private socket: WebSocket | null = null;

  public configure(instanceConfiguration: WebSocketNotificationsConfig) {
    console.log("INIT CONFIG", instanceConfiguration);
    this.config = ConfigManager.createConfig(instanceConfiguration);
    console.log("CONFIG", this.config);
  }

  public run(): void {
    this.checkConfig();
    this.connect();
    this.setupListeners();
  }

  public stop(): void {
    this.disconnect();
    this.resetState();
  }

  private checkConfig(): void {
    const isConfigValid = ConfigManager.isConfigValid(this.config);
    console.log("Checking config", this.config, isConfigValid);
    if (!isConfigValid) {
      throw new Error("Config cannot be initialised");
    }
  }

  private connect(): void {
    const url: string | undefined = this.config?.getConnectionUrl();
    if (!url) {
      throw new Error("Config URL is undefined");
    }
    this.socket = new WebSocket(url);
  }

  private disconnect(): void {
    if (!this.socket) {
      return;
    }
    this.socket?.close();
  }

  private resetState(): void {
    this.config = null;
    this.socket = null;
  }

  private setupListeners() {
    if (!this.socket) {
      throw new Error("Cannot setup listeners, socket is undefined");
    }
    this.socket.onmessage = (event: any) => {
      console.log(event.data);
      // store.dispatch("notifications/addNotification", JSON.parse(event.data));
    };
    this.socket.onopen = (event: Event) => {
      // this.sendMessage({ action: "getNotifications" });
      console.log(event);
    };
    this.socket.onerror = (event: Event) => {
      console.log(event);
    };
    this.socket.onclose = (event: Event) => {
      console.log(event);
    };
  }

  private sendMessage(data: SocketData): void {
    const JSONStrigifiedData = JSON.stringify(data);
    console.log(this.socket, JSONStrigifiedData);
    this.socket?.send(JSONStrigifiedData);
  }
}
