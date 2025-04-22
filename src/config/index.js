/**
 * Configuration settings loaded from environment variables
 */
require('dotenv').config();

// Define configuration with default values for non-sensitive settings
const config = {
  // Server settings
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database settings
  mongoURI: process.env.NODE_ENV === 'test' 
    ? process.env.MONGODB_URI_TEST 
    : process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-blog-db',
  
  // JWT Auth settings
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  
  // OpenAI API settings
  openaiApiKey: process.env.OPENAI_API_KEY,
  
  // CORS settings
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests per window
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Scheduler settings
  postsGenerationSchedule: process.env.POSTS_GENERATION_SCHEDULE || '0 2 * * *', // Daily at 2am by default
};

// Verify that required environment variables are set
const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI',
  'OPENAI_API_KEY'
];

// In production mode, make sure all required variables are set
if (config.nodeEnv === 'production') {
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

module.exports = config;