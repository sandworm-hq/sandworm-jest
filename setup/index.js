const path = require('path');
const {
  recorder: {recordSandwormActivity},
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

module.exports = async () => {
  logger.log('Starting listener...');
  await recordSandwormActivity((err) => {
    logger.log('Error listening for events:', err);
  });
};
