const path = require('path');
const {
  recorder: {stopRecordingSandwormActivity, getRecordedActivity},
  files: {loadConfig, writePermissions, loadPermissions, SANDWORM_PERMISSION_FILE_NAME},
  permissions: {getPermissionsFromActivity, getPackagePermissions, comparePermissions},
  logger,
  graph,
} = require('sandworm-utils');

const appPath = process.env.SANDWORM_APP_PATH || path.join(__dirname, '..', '..', '..');
const config = loadConfig(appPath);

module.exports = async () => {
  const activity = getRecordedActivity();
  logger.log(`Intercepted ${activity.length} events`);

  await stopRecordingSandwormActivity();

  const {devDependencies, prodDependencies} = await graph(appPath);
  const ignoredModules =
    config && Array.isArray(config.ignoredModules) ? config.ignoredModules : [];
  const permissions = getPermissionsFromActivity(activity);

  const currentPermissions = loadPermissions(appPath);
  const newPermissions = getPackagePermissions({
    permissions,
    devDependencies: devDependencies.map(({name}) => name),
    prodDependencies: prodDependencies.map(({name}) => name),
    ignoredModules,
  });

  if (!currentPermissions) {
    await writePermissions(appPath, newPermissions);
    logger.logTestPluginFirstRunMessage();
  } else {
    const {changes, messages} = comparePermissions(currentPermissions, newPermissions);

    if (changes.length === 0) {
      logger.success('✔ Permission snapshot matches current test run');
    }

    if (changes.length > 0) {
      throw new Error(
        `Sandworm: Permission mismatch:\n${messages.join(
          '\n',
        )}\nPlease verify and update the \`${SANDWORM_PERMISSION_FILE_NAME}\` file.`,
      );
    }
  }
};
