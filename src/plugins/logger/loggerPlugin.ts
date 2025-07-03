import { trace, debug, info, warn, error, setLevel, LogLevelNames as DefaultLogLevelNames } from 'loglevel';

import { App } from "vue";
import type { SettableLogLevel } from './types';
import { appConfig } from '@/data/appConfig';

export type LogLevelNames = DefaultLogLevelNames | 'success';

export class Logger {
  constructor() {
    this.setLevel(appConfig.logger.logLevel);
  }
  private formatLogMessage(level: LogLevelNames, moduleName: string, message: any) {
    if(level === 'error') return message; //INFO: allows you to print the stacktrace of error

    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0]; //INFO: format 2025-04-28 12:07:35
    return `[${timestamp}] [${level.toUpperCase()}] [${moduleName}] ${message}`;
  };
  public setLevel(level: SettableLogLevel) {
    setLevel(level);
  }
  public log(level: LogLevelNames, moduleName: string, message: any) {
    const logMethods: Record<LogLevelNames, any> = {
      trace,
      debug,
      info,
      warn,
      error,
      success: info,
    };

    const formattedMessage = this.formatLogMessage(level, moduleName, message);
    logMethods[level](formattedMessage);
  }
}
export const logger = new Logger();

export default {
  install: (app: App): void => {
    app.config.globalProperties.$logger = logger;
  }
}