export const DATABASE_CONSTANTS = {
  DEFAULT_CACHE_TTL: 60000, // 60 seconds
  MAX_CACHE_ITEMS: 100,
  DEFAULT_DB_TYPE: 'postgres',
  SQLITE_SYNC: true,
  POSTGRES_SYNC: false,
  MIGRATIONS_RUN: true,
} as const;

export const DATABASE_CONFIG_KEYS = {
  DB_TYPE: 'DB_TYPE',
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USERNAME: 'DB_USERNAME',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_DATABASE: 'DB_DATABASE',
  NODE_ENV: 'NODE_ENV',
  CACHE_TTL: 'CACHE_TTL',
} as const;

export const DATABASE_TYPES = {
  SQLITE: 'sqlite',
  POSTGRES: 'postgres',
} as const;