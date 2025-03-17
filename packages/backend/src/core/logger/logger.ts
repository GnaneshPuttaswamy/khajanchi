import winston from 'winston';

interface LoggerConfig {
  logLevel?: string;
  nodeEnv?: string;
  logFilePath?: string;
}

type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

export class Logger {
  private static instance: winston.Logger;

  private constructor() {}

  public static getInstance(config: LoggerConfig = {}): winston.Logger {
    let logLevel: LogLevel;
    let logFilePath: string;

    let fileTransport: winston.transports.FileTransportInstance;
    let consoleTransport: winston.transports.ConsoleTransportInstance;

    if (!Logger.instance) {
      logLevel = (config.logLevel as LogLevel) || 'info';
      logFilePath = config.logFilePath || 'error.log';

      fileTransport = new winston.transports.File({
        filename: logFilePath,
        level: logLevel,
      });

      consoleTransport = new winston.transports.Console({
        format: winston.format.combine(winston.format.prettyPrint()),
      });

      Logger.instance = winston.createLogger({
        level: logLevel,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
          winston.format.errors({ stack: true }),
          winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
        ),
        transports: [fileTransport],
      });

      if (config.nodeEnv === 'development') {
        Logger.instance.add(consoleTransport);
      }
    }

    return Logger.instance;
  }
}

export const logger = Logger.getInstance({
  logLevel: process.env.LOG_LEVEL || 'info',
  nodeEnv: process.env.NODE_ENV || 'development',
  logFilePath: process.env.LOG_FILE_PATH || 'error.log',
});
