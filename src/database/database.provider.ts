import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../api/products/entities/product.entity';
import {
  DATABASE_CONSTANTS,
  DATABASE_CONFIG_KEYS,
  DATABASE_TYPES,
} from './database.constants';
import { DEFAULT_DATASOURCE } from './constants';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Scope } from '@nestjs/common';

/**
 * Array of database entities to be registered with TypeORM
 */
export const databaseEntities = [Product];

/**
 * Creates TypeORM module configuration based on environment variables
 * Supports both SQLite and PostgreSQL databases
 * 
 * @param configService - NestJS ConfigService instance
 * @returns TypeORM module options
 * @throws Error if required configuration is missing
 */
export const createDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbType = configService.get(DATABASE_CONFIG_KEYS.DB_TYPE) || DATABASE_CONSTANTS.DEFAULT_DB_TYPE;
  const nodeEnv = configService.get(DATABASE_CONFIG_KEYS.NODE_ENV);
  const isDevelopment = nodeEnv === 'development';

  if (dbType === DATABASE_TYPES.SQLITE) {
    const database = configService.get(DATABASE_CONFIG_KEYS.DB_DATABASE);
    if (!database) {
      throw new Error('SQLite database path is required');
    }

    return {
      type: 'sqlite',
      database,
      entities: databaseEntities,
      synchronize: DATABASE_CONSTANTS.SQLITE_SYNC,
      logging: isDevelopment,
    };
  }

  // PostgreSQL configuration with validation
  const host = configService.get(DATABASE_CONFIG_KEYS.DB_HOST);
  const port = configService.get(DATABASE_CONFIG_KEYS.DB_PORT);
  const username = configService.get(DATABASE_CONFIG_KEYS.DB_USERNAME);
  const password = configService.get(DATABASE_CONFIG_KEYS.DB_PASSWORD);
  const database = configService.get(DATABASE_CONFIG_KEYS.DB_DATABASE);

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
    entities: databaseEntities,
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: DATABASE_CONSTANTS.MIGRATIONS_RUN,
    synchronize: DATABASE_CONSTANTS.POSTGRES_SYNC,
    logging: isDevelopment,
  };
};

/**
 * Creates cache configuration for the application
 * 
 * @param configService - NestJS ConfigService instance
 * @returns Cache configuration object
 */
export const createCacheConfig = (configService: ConfigService) => ({
  ttl: +configService.get(DATABASE_CONFIG_KEYS.CACHE_TTL) || DATABASE_CONSTANTS.DEFAULT_CACHE_TTL,
  max: DATABASE_CONSTANTS.MAX_CACHE_ITEMS,
});

/**
 * Converts TypeOrmModuleOptions to DataSourceOptions
 * Filters out NestJS-specific properties that are not compatible with TypeORM DataSource
 * 
 * @param config - TypeORM module options
 * @returns DataSource options compatible with TypeORM DataSource constructor
 * @throws Error if database type is not specified
 */
export const convertToDataSourceOptions = (config: TypeOrmModuleOptions): DataSourceOptions => {
  if (!config.type) {
    throw new Error('Database type must be specified in configuration');
  }

  if (config.type === 'sqlite') {
    return {
      type: config.type,
      database: (config as any).database,
      entities: config.entities,
      synchronize: (config as any).synchronize,
      logging: (config as any).logging,
    } as DataSourceOptions;
  }

  if (config.type === 'postgres') {
    return {
      type: config.type,
      host: (config as any).host,
      port: (config as any).port,
      username: (config as any).username,
      password: (config as any).password,
      database: (config as any).database,
      entities: config.entities,
      migrations: (config as any).migrations,
      migrationsRun: (config as any).migrationsRun,
      synchronize: (config as any).synchronize,
      logging: (config as any).logging,
    } as DataSourceOptions;
  }

  throw new Error(`Unsupported database type: ${config.type}`);
};

/**
 * Database providers array for NestJS dependency injection
 * Uses factory pattern to create DataSource instance with proper configuration
 */
export const databaseProviders = [
  {
    provide: DEFAULT_DATASOURCE,
    useFactory: async (configService: ConfigService): Promise<DataSource> => {
      try {
        const config = createDatabaseConfig(configService);
        const dataSourceOptions = convertToDataSourceOptions(config);
        const dataSource = new DataSource(dataSourceOptions);
        return await dataSource.initialize();
      } catch (error) {
        throw new Error(`Failed to initialize database connection: ${error.message}`);
      }
    },
    inject: [ConfigService],
    scope: Scope.DEFAULT,
  },
];
