/**
 * Application Entry Point
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { rateLimit } = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Load environment variables
const config = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { connectDB } = require('./config/database');

// Initialize scheduler if not in test mode
if (process.env.NODE_ENV !== 'test') {
  require('./modules/scheduler');
}

// Create Express app
const app = express();

// Apply security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Apply compression for responses
app.use(compression());

// Add request logging
app.use(require('pino-http')({ logger }));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API versioning and base path
const API_PREFIX = '/api';

// Swagger documentation setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Blog API',
      version: '1.0.0',
      description: 'API for AI-powered blog platform',
      contact: {
        name: 'API Support',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}${API_PREFIX}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(`${API_PREFIX}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check endpoint
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Mount API routes
app.use(`${API_PREFIX}/auth`, require('./modules/auth/auth.routes'));
app.use(`${API_PREFIX}/posts`, require('./modules/posts/posts.routes'));

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Global error handler
app.use(errorHandler);

// Server startup function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start the server
    app.listen(config.port, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
      logger.info(`API Documentation available at http://localhost:${config.port}${API_PREFIX}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// For testing purposes, don't start the server when required
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, startServer };