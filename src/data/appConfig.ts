import type { SettableLogLevel } from "@/plugins/logger/types";
import { NotificationLevel } from "@/plugins/notifications/notificationsPlugin";
import { LogLevelNames } from "@/plugins/logger/loggerPlugin";

type AppConfig = {
  logger: {
    logLevel: SettableLogLevel,
  }
  notifications: {
    duration: number, //ms
    maxCount: number, //max notifications count
  },
  loggerNotifications: {
    loggerLevelToNotificationLevelMap: {[P in LogLevelNames]?: NotificationLevel}
  }
}
export const appConfig: AppConfig = {
  logger: {
    logLevel: 'debug',
  },
  notifications: {
    duration: 5000, //-1 for disable autoclose
    maxCount: 100,
  },
  loggerNotifications: {
    loggerLevelToNotificationLevelMap: {
      success: 'success',
      info: 'info',
      warn: 'warn',
      error: 'error',
    }
  }
}