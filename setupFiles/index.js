const path = require('path');
const {
  sandworm: {loadSandworm},
} = require('sandworm-utils');

const appPath = process.env.SANDWORM_APP_PATH || path.join(__dirname, '..', '..', '..');

loadSandworm({appPath});
