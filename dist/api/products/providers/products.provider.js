"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsProviders = exports.productsServiceProvider = exports.productsConfigProvider = exports.PRODUCTS_PROVIDERS = void 0;
const products_service_1 = require("../services/products.service");
const constants_1 = require("../constants");
const product_repository_1 = require("../repositories/product.repository");
const product_entity_1 = require("../entities/product.entity");
const constants_2 = require("../../../database/constants");
exports.PRODUCTS_PROVIDERS = {
    PRODUCTS_SERVICE: 'PRODUCTS_SERVICE',
    PRODUCTS_CONFIG: 'PRODUCTS_CONFIG',
};
exports.productsConfigProvider = {
    provide: exports.PRODUCTS_PROVIDERS.PRODUCTS_CONFIG,
    useValue: {
        defaultPageSize: constants_1.PRODUCTS_CONSTANTS.DEFAULT_PAGE_SIZE,
        maxPageSize: constants_1.PRODUCTS_CONSTANTS.MAX_PAGE_SIZE,
        defaultSortField: constants_1.PRODUCTS_CONSTANTS.DEFAULT_SORT_FIELD,
        defaultSortOrder: constants_1.PRODUCTS_CONSTANTS.DEFAULT_SORT_ORDER,
        cacheKeyPrefix: constants_1.PRODUCTS_CONSTANTS.CACHE_KEY_PREFIX,
        cacheTtl: constants_1.PRODUCTS_CONSTANTS.CACHE_TTL,
    },
};
exports.productsServiceProvider = {
    provide: exports.PRODUCTS_PROVIDERS.PRODUCTS_SERVICE,
    useClass: products_service_1.ProductsService,
};
exports.productsProviders = [
    exports.productsConfigProvider,
    exports.productsServiceProvider,
    {
        provide: constants_1.PRODUCTS_REPOSITORY,
        useFactory: (dataSource) => new product_repository_1.ProductRepository(product_entity_1.Product, dataSource.createEntityManager()),
        inject: [constants_2.DEFAULT_DATASOURCE],
    },
];
//# sourceMappingURL=products.provider.js.map