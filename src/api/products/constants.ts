export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export const PRODUCTS_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
  DEFAULT_SORT_FIELD: 'createdAt',
  DEFAULT_SORT_ORDER: 'DESC',
  CACHE_KEY_PREFIX: 'products',
  CACHE_TTL: 300000, // 5 minutes
} as const;

export const PRODUCTS_VALIDATION = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
  PRICE_MIN: 0,
  PRICE_MAX: 999999.99,
  SKU_MIN_LENGTH: 1,
  SKU_MAX_LENGTH: 100,
} as const;

export const PRODUCTS_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  INVALID_PRODUCT_ID: 'Invalid product ID',
  DUPLICATE_SKU: 'Product with this SKU already exists',
} as const;

export const PRODUCTS_SORT_FIELDS = {
  ID: 'id',
  NAME: 'name',
  PRICE: 'price',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;