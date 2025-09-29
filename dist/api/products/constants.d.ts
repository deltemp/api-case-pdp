export declare const PRODUCTS_REPOSITORY = "PRODUCTS_REPOSITORY";
export declare const PRODUCTS_CONSTANTS: {
    readonly DEFAULT_PAGE_SIZE: 10;
    readonly MAX_PAGE_SIZE: 100;
    readonly MIN_PAGE_SIZE: 1;
    readonly DEFAULT_SORT_FIELD: "createdAt";
    readonly DEFAULT_SORT_ORDER: "DESC";
    readonly CACHE_KEY_PREFIX: "products";
    readonly CACHE_TTL: 300000;
};
export declare const PRODUCTS_VALIDATION: {
    readonly NAME_MIN_LENGTH: 1;
    readonly NAME_MAX_LENGTH: 255;
    readonly DESCRIPTION_MAX_LENGTH: 1000;
    readonly PRICE_MIN: 0;
    readonly PRICE_MAX: 999999.99;
    readonly SKU_MIN_LENGTH: 1;
    readonly SKU_MAX_LENGTH: 100;
};
export declare const PRODUCTS_MESSAGES: {
    readonly PRODUCT_NOT_FOUND: "Product not found";
    readonly PRODUCT_CREATED: "Product created successfully";
    readonly PRODUCT_UPDATED: "Product updated successfully";
    readonly PRODUCT_DELETED: "Product deleted successfully";
    readonly INVALID_PRODUCT_ID: "Invalid product ID";
    readonly DUPLICATE_SKU: "Product with this SKU already exists";
};
export declare const PRODUCTS_SORT_FIELDS: {
    readonly ID: "id";
    readonly NAME: "name";
    readonly PRICE: "price";
    readonly CREATED_AT: "createdAt";
    readonly UPDATED_AT: "updatedAt";
};
export declare const SORT_ORDER: {
    readonly ASC: "ASC";
    readonly DESC: "DESC";
};
