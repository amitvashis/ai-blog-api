/**
 * Request validation middleware using Joi
 */
const Joi = require('joi');
const { ApiError } = require('./errorHandler');

/**
 * Validate request data against schema
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, params, query)
 * @returns {Function} Middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (!error) {
      return next();
    }

    const messages = error.details.map((detail) => detail.message).join(', ');
    next(new ApiError(400, `Validation error: ${messages}`));
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // User schemas
  userRegister: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Post schemas
  createPost: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(20).required(),
    summary: Joi.string().max(500),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'published').default('draft'),
  }),

  updatePost: Joi.object({
    title: Joi.string().min(5).max(200),
    content: Joi.string().min(20),
    summary: Joi.string().max(500),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'published'),
  }),

  // ID parameter schema
  idParam: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
      .messages({
        'string.pattern.base': 'ID must be a valid MongoDB ObjectId',
      }),
  }),

  // Query parameters for pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
    status: Joi.string().valid('draft', 'published'),
    tags: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    search: Joi.string(),
  }),
};

module.exports = { validate, schemas };