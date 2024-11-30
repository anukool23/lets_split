const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log directory path
const logDirectory = path.join(__dirname, '../logs');

// Logger configuration
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Console logging (enabled only in development)
    new transports.Console({
      silent: process.env.ENVIRONMENT !== 'dev',
    }),

    // Daily rotating file logging
    new DailyRotateFile({
      filename: path.join(logDirectory, '%DATE%.log'), // Filename will be date-based
      datePattern: 'YYYY-MM-DD', // Log file per day
      maxFiles: '30d', // Keep logs for the last 30 days
      zippedArchive: true, // Compress older logs
      level: 'info', // Log level
    }),
  ],
});

// Export logger
module.exports = logger;
