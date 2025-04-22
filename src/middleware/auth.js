/**
 * Authentication middleware
 */
const jwt = require('jsonwebtoken');
const config = require('../config');
const { ApiError } = require('./errorHandler');
const logger = require('../utils/logger');

/**
 * Middleware to protect routes - verifies JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
    }
    
    // If no token found, return unauthorized error
    if (!token) {
      return next(new ApiError(401, 'Not authorized, no token provided'));
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Add user from payload to request object
      req.user = decoded;
      
      next();
    } catch (error) {
      logger.warn({ err: error }, 'Token verification failed');
      
      if (error.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Token expired'));
      }
      
      return next(new ApiError(401, 'Not authorized, invalid token'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists and has role
    if (!req.user || !req.user.role) {
      return next(new ApiError(403, 'No permission to access this resource'));
    }
    
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Role ${req.user.role} is not authorized to access this resource`)
      );
    }
    
    next();
  };
};

module.exports = { protect, authorize };