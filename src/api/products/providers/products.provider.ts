import { Provider } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { PRODUCTS_CONSTANTS, PRODUCTS_REPOSITORY } from '../constants';
import { DataSource } from 'typeorm';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../entities/product.entity';
import { DEFAULT_DATASOURCE } from 'src/database/constants';

export const PRODUCTS_PROVIDERS = {
  PRODUCTS_SERVICE: 'PRODUCTS_SERVICE',
  PRODUCTS_CONFIG: 'PRODUCTS_CONFIG',
} as const;

export const productsConfigProvider: Provider = {
  provide: PRODUCTS_PROVIDERS.PRODUCTS_CONFIG,
  useValue: {
    defaultPageSize: PRODUCTS_CONSTANTS.DEFAULT_PAGE_SIZE,
    maxPageSize: PRODUCTS_CONSTANTS.MAX_PAGE_SIZE,
    defaultSortField: PRODUCTS_CONSTANTS.DEFAULT_SORT_FIELD,
    defaultSortOrder: PRODUCTS_CONSTANTS.DEFAULT_SORT_ORDER,
    cacheKeyPrefix: PRODUCTS_CONSTANTS.CACHE_KEY_PREFIX,
    cacheTtl: PRODUCTS_CONSTANTS.CACHE_TTL,
  },
};

export const productsServiceProvider: Provider = {
  provide: PRODUCTS_PROVIDERS.PRODUCTS_SERVICE,
  useClass: ProductsService,
};

export const productsProviders = [
  productsConfigProvider,
  productsServiceProvider,
  {
        provide: PRODUCTS_REPOSITORY,
        useFactory: (dataSource: DataSource) => new ProductRepository(Product, dataSource.createEntityManager()),
        inject: [DEFAULT_DATASOURCE],
    },
];