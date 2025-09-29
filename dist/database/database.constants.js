"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_TYPES = exports.DATABASE_CONFIG_KEYS = exports.DATABASE_CONSTANTS = void 0;
exports.DATABASE_CONSTANTS = {
    DEFAULT_CACHE_TTL: 60000,
    MAX_CACHE_ITEMS: 100,
    DEFAULT_DB_TYPE: 'postgres',
    SQLITE_SYNC: true,
    POSTGRES_SYNC: false,
    MIGRATIONS_RUN: true,
};
exports.DATABASE_CONFIG_KEYS = {
    DB_TYPE: 'DB_TYPE',
    DB_HOST: 'DB_HOST',
    DB_PORT: 'DB_PORT',
    DB_USERNAME: 'DB_USERNAME',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_DATABASE: 'DB_DATABASE',
    NODE_ENV: 'NODE_ENV',
    CACHE_TTL: 'CACHE_TTL',
};
exports.DATABASE_TYPES = {
    SQLITE: 'sqlite',
    POSTGRES: 'postgres',
};
//# sourceMappingURL=database.constants.js.map