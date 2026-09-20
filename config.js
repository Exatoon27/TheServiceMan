const DEFAULT_DATABASE_URL = './database.sqlite';

function getEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

function assertRequiredEnv(variableNames) {
  const missing = variableNames.filter((name) => !getEnv(name));

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
      'Set them before running the bot (see .env.example / README).',
    );
  }
}

const DISCORD_TOKEN = getEnv('DISCORD_TOKEN');
const CLIENT_ID = getEnv('CLIENT_ID');
const DATABASE_URL = getEnv('DATABASE_URL') || DEFAULT_DATABASE_URL;

module.exports = {
  DISCORD_TOKEN,
  CLIENT_ID,
  DATABASE_URL,
  assertRequiredEnv,
};
