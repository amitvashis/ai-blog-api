/**
 * MongoDB database connection
 */
const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  try {
    // Configure mongoose options
    const mongooseOptions = {
      // Automatically retry failed operations
      retryWrites: true,
      // Apply indexes defined in the schema
      autoIndex: process.env.NODE_ENV !== 'production'
    };

    // Connect to the database
    const conn = await mongoose.connect(config.mongoURI, mongooseOptions);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', err => {
      logger.error('MongoDB connection error:', err);
    });
    
    // Log when connection is disconnected
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    // Handle process termination and close the connection
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return mongoose;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Close the MongoDB connection - useful for tests
 * @returns {Promise<void>}
 */
const closeDB = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
};

module.exports = { connectDB, closeDB };