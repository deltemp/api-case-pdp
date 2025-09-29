"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = exports.convertToDataSourceOptions = exports.createCacheConfig = exports.createDatabaseConfig = exports.databaseEntities = void 0;
const config_1 = require("@nestjs/config");
const product_entity_1 = require("../api/products/entities/product.entity");
const database_constants_1 = require("./database.constants");
const constants_1 = require("./constants");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
exports.databaseEntities = [product_entity_1.Product];
const createDatabaseConfig = (configService) => {
    const dbType = configService.get(database_constants_1.DATABASE_CONFIG_KEYS.DB_TYPE) || database_constants_1.DATABASE_CONSTANTS.DEFAULT_DB_TYPE;
    const nodeEnv = configService.get(database_constants_1.DATABASE_CONFIG_KEYS.NODE_ENV);
    const isDevelopment = nodeEnv === 'development';
    if (dbType === database_constants_1.DATABASE_TYPES.SQLITE) {
        const database = configService.get(database_constants_1.DATABASE_CONFIG_KEYS.DB_DATABASE);
        if (!database) {
            throw new Error('SQLite database path is required');
        }
        return {
            type: 'sqlite',
            database,
            entities: exports.databaseEntities,
            synchronize: database_constants_1.DATABASE_CONSTANTS.SQLITE_SYNC,
            logging: isDevelopment,
        };
    }
    const host = configService.get(database_constants_1.DATABASE_CONFIG_KEYS.DB_HOST);
    const port = configService.get(database_constants_1.DATABASE_CONFIG_KEYS.DB_PORT);
    const username = configService.get(database_constants_1.DATABASE_CONFIG_KEYS.DB_USERNAME);
    const password = configService.get(database_constants_1.DATABASE_CONFIG_KEYS.DB_PASSWORD);
    const database = configService.get(database_constants_1.DATABASE_CONFIG_KEYS.DB_DATABASE);
    if (!host || !port || !username || !password || !database) {
        throw new Error('PostgreSQL configuration is incomplete. Please check DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, and DB_DATABASE environment variables.');
    }
    return {
        type: 'postgres',
        host,
        port: +port,
        username,
        password,
        database,
        entities: exports.databaseEntities,
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: database_constants_1.DATABASE_CONSTANTS.MIGRATIONS_RUN,
        synchronize: database_constants_1.DATABASE_CONSTANTS.POSTGRES_SYNC,
        logging: isDevelopment,
    };
};
exports.createDatabaseConfig = createDatabaseConfig;
const createCacheConfig = (configService) => ({
    ttl: +configService.get(database_constants_1.DATABASE_CONFIG_KEYS.CACHE_TTL) || database_constants_1.DATABASE_CONSTANTS.DEFAULT_CACHE_TTL,
    max: database_constants_1.DATABASE_CONSTANTS.MAX_CACHE_ITEMS,
});
exports.createCacheConfig = createCacheConfig;
const convertToDataSourceOptions = (config) => {
    if (!config.type) {
        throw new Error('Database type must be specified in configuration');
    }
    if (config.type === 'sqlite') {
        return {
            type: config.type,
            database: config.database,
            entities: config.entities,
            synchronize: config.synchronize,
            logging: config.logging,
        };
    }
    if (config.type === 'postgres') {
        return {
            type: config.type,
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password,
            database: config.database,
            entities: config.entities,
            migrations: config.migrations,
            migrationsRun: config.migrationsRun,
            synchronize: config.synchronize,
            logging: config.logging,
        };
    }
    throw new Error(`Unsupported database type: ${config.type}`);
};
exports.convertToDataSourceOptions = convertToDataSourceOptions;
exports.databaseProviders = [
    {
        provide: constants_1.DEFAULT_DATASOURCE,
        useFactory: async (configService) => {
            try {
                const config = (0, exports.createDatabaseConfig)(configService);
                const dataSourceOptions = (0, exports.convertToDataSourceOptions)(config);
                const dataSource = new typeorm_1.DataSource(dataSourceOptions);
                return await dataSource.initialize();
            }
            catch (error) {
                throw new Error(`Failed to initialize database connection: ${error.message}`);
            }
        },
        inject: [config_1.ConfigService],
        scope: common_1.Scope.DEFAULT,
    },
];
//# sourceMappingURL=database.provider.js.map