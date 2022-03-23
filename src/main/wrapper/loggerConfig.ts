import { configure, getLogger } from 'log4js';

export function getLoggerWithFilePath(logFilePath ?: string) {

  if(logFilePath) {
    configure({
      appenders: {
        file: { type: 'fileSync', filename: logFilePath ? logFilePath : "" },
        console: { type: 'stdout', layout: { type: "messagePassThrough" } },
    },
    categories: {
        default: { appenders: ['console', 'file'], level: "info" }
      }
    });

  } else {
    configure({
      appenders: {
        console: { type: 'stdout', layout: { type: "messagePassThrough" } },
    },
    categories: {
        default: { appenders: ['console'], level: "info" }
      }
    });
  }
} 

export const logger = getLogger();