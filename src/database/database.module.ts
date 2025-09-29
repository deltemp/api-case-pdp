import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createDatabaseConfig, createCacheConfig, databaseProviders } from './database.provider';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createDatabaseConfig,
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: createCacheConfig,
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  providers: [...databaseProviders],
  exports: [TypeOrmModule, CacheModule, ...databaseProviders],
})
export class DatabaseModule { }