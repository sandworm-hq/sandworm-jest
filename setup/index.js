const {
  recorder: {recordSandwormActivity},
  logger,
} = require('sandworm-utils');

module.exports = async () => {
  logger.log('Starting listener...');
  await recordSandwormActivity((err) => {
    logger.log('Error listening for events:', err);
  });
};
