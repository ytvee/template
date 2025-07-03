import { LogLevelNames } from "@/plugins/logger/loggerPlugin";
import { App } from "vue";
import { Logger } from "../logger/loggerPlugin";
import { Notifications, NotificationOptions } from "../notifications/notificationsPlugin";
import { appConfig } from "@/data/appConfig";

type LoggerNotificationsOptions = Partial<{
  // loggerOptions: 
  notificationOptions: NotificationOptions,
  disableNotification: boolean;
}>

export class LoggerNotifications {
  private logger: Logger;
  private notifications: Notifications;
  constructor(app: App) {
    if(!app.config.globalProperties.$logger) {
      throw new Error('logger plugin must be used before loggerNotificationPlugin!');
    }
    this.logger = app.config.globalProperties.$logger;
    if(!app.config.globalProperties.$notifications) {
      throw new Error('notifications plugin must be used before loggerNotificationPlugin!');
    }
    this.notifications = app.config.globalProperties.$notifications;
  }
  private isNotificationDisabledInOptions(options?: LoggerNotificationsOptions) {
    return options && options.disableNotification
  }
  public log(level: LogLevelNames, moduleName: string, message: any, options?: LoggerNotificationsOptions) {
    this.logger.log(level, moduleName, message);
    
    if(this.isNotificationDisabledInOptions()) {
      return;
    }
    const notificationLevel = appConfig.loggerNotifications.loggerLevelToNotificationLevelMap[level];
    if(notificationLevel !== undefined) {
      this.notifications.notify(notificationLevel, message, options?.notificationOptions);
    }
  }
}

export default {
  install: (app: App): void => {
    app.config.globalProperties.$loggerNotifications = new LoggerNotifications(app);
  }
}