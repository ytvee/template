import { App, createApp } from "vue";
import store from "@/store/store"

export type NotificationLevel = 'success' | 'info' | 'warn' | "error";
export type NotificationOptions = Partial<{
  duration: number;
}>
export class Notifications {
  public notify(notificationLevel: NotificationLevel, message: any, options?: NotificationOptions) {
    store.dispatch("localNotifications/notify", {notificationLevel, message, options})
  }
  public clear() {

  }
} 
export default {
  install: (app: App): void => {
    app.config.globalProperties.$notifications = new Notifications();
  }
}