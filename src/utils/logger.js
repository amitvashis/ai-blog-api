/**
 * Application logger configuration
 * Using pino for structured JSON logging
 */
const pino = require('pino');
const config = require('../config');

// Define log levels
const levels = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};

// Configure base logger options
const options = {
  level: config.logLevel || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  // Redact sensitive information from logs
  redact: {
    paths: [
      'password',
      'token',
      'authorization',
      'req.headers.authorization',
      '*.password',
      '*.token',
      'req.body.password',
    ],
    censor: '[REDACTED]',
  },
};

// For development, make logs more readable
if (config.nodeEnv !== 'production') {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

// Create the logger instance
const logger = pino(options);

// Export the logger
module.exports = logger;