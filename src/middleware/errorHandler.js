/**
 * Centralized error handling middleware
 */
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Convert various error types to ApiError
 */
const convertError = (err) => {
  let error = err;
  
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    const isOperational = false;
    
    error = new ApiError(statusCode, message, isOperational, err.stack);
  }
  
  return error;
};

/**
 * Handle errors and send appropriate response
 */
const errorHandler = (err, req, res, next) => {
  const error = convertError(err);
  
  // Log error details
  logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${error.statusCode}, Message:: ${error.message}`, {
    stack: error.stack,
    isOperational: error.isOperational,
  });
  
  // Send error response
  const response = {
    status: 'error',
    message: error.message,
  };
  
  // Include stack trace in development mode
  if (config.env === 'development' && !error.isOperational) {
    response.stack = error.stack;
  }
  
  res.status(error.statusCode).json(response);
};

/**
 * Handle 404 errors for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Not found - ${req.originalUrl}`);
  next(error);
};

module.exports = {
  ApiError,
  errorHandler,
  notFoundHandler,
};