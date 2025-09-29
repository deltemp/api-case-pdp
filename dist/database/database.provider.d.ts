import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../api/products/entities/product.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Scope } from '@nestjs/common';
export declare const databaseEntities: (typeof Product)[];
export declare const createDatabaseConfig: (configService: ConfigService) => TypeOrmModuleOptions;
export declare const createCacheConfig: (configService: ConfigService) => {
    ttl: number;
    max: 100;
};
export declare const convertToDataSourceOptions: (config: TypeOrmModuleOptions) => DataSourceOptions;
export declare const databaseProviders: {
    provide: string;
    useFactory: (configService: ConfigService) => Promise<DataSource>;
    inject: (typeof ConfigService)[];
    scope: Scope;
}[];
