const Sandworm = require('sandworm');
const path = require('path');
const {
  files: {loadConfig},
  logger,
} = require('sandworm-utils');

const appPath = process.env.SANDWORM_APP_PATH || path.join(__dirname, '..', '..', '..');
let config;

try {
  config = loadConfig(appPath);
  if (config) {
    logger.log('Config loaded');
  }
} catch (error) {
  logger.log('Error loading config:', error.message);
}

globalThis.SANDWORM_CONFIG = config;

// Load Sandworm
logger.log('Setting up intercepts...');
Sandworm.init({
  devMode: true,
  aliases: config && config.aliases,
});
logger.log('Intercepts ready');
