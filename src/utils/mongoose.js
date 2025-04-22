const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('../config/config');

const connect = async () => {
  try {
    const connection = await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');
    return connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const disconnect = async () => {
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
};

module.exports = {
  connect,
  disconnect,
};