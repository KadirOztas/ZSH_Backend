import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOGGING_LEVEL,
  format: winston.format.json(),
  defaultMeta: { service: process.env.LOGGING_SERVICE_LABEL },
  transports: [
    new winston.transports.File({ filename: process.env.LOG_ERROR_FILE_PATH, level: 'error' }),
    new winston.transports.File({ filename: process.env.LOG_COMBINED_FILE_PATH }),
  ],
});


if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.json(),
  }));
}

export default logger;