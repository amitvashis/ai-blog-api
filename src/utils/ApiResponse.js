/**
 * ApiResponse Class
 * Standardized API response format
 */
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  /**
   * Create success response
   * @param {Object} data - Response data
   * @param {string} message - Success message
   * @returns {ApiResponse} API response object
   */
  static success(data, message = 'Success') {
    return new ApiResponse(200, data, message);
  }

  /**
   * Create error response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Object|null} errors - Validation errors
   * @returns {ApiResponse} API response object
   */
  static error(statusCode = 500, message = 'Internal Server Error', errors = null) {
    return new ApiResponse(statusCode, { errors }, message);
  }
}

module.exports = ApiResponse;