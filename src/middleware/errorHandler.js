/**
 * Global error handling middleware
 */
const logger = require('../utils/logger');

/**
 * Custom API error class
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if statusCode not set
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // For operational errors, we return details to the client
  // For programming or other unknown errors, we return a generic message
  const responseMessage = 
    statusCode >= 500 && !err.isOperational
      ? 'Internal Server Error'
      : message;
  
  // Log all errors
  if (statusCode >= 500) {
    logger.error({
      err,
      stack: err.stack,
      statusCode,
      method: req.method,
      path: req.path,
      body: req.body,
      params: req.params,
      query: req.query,
    }, 'Error occurred');
  } else {
    logger.warn({
      err,
      statusCode,
      method: req.method,
      path: req.path,
    }, 'Client error occurred');
  }
  
  // Send response
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: responseMessage,
    },
  });
};

/**
 * Handle uncaught exceptions and unhandled rejections
 */
const setupUncaughtHandlers = () => {
  // Uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.fatal({ err: error, stack: error.stack }, 'Uncaught Exception');
    process.exit(1);
  });
  
  // Unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.fatal({ err: reason, stack: reason.stack }, 'Unhandled Promise Rejection');
    process.exit(1);
  });
};

// Call setup immediately when imported
setupUncaughtHandlers();

module.exports = errorHandler;
module.exports.ApiError = ApiError;