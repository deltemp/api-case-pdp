export declare const DATABASE_CONSTANTS: {
    readonly DEFAULT_CACHE_TTL: 60000;
    readonly MAX_CACHE_ITEMS: 100;
    readonly DEFAULT_DB_TYPE: "postgres";
    readonly SQLITE_SYNC: true;
    readonly POSTGRES_SYNC: false;
    readonly MIGRATIONS_RUN: true;
};
export declare const DATABASE_CONFIG_KEYS: {
    readonly DB_TYPE: "DB_TYPE";
    readonly DB_HOST: "DB_HOST";
    readonly DB_PORT: "DB_PORT";
    readonly DB_USERNAME: "DB_USERNAME";
    readonly DB_PASSWORD: "DB_PASSWORD";
    readonly DB_DATABASE: "DB_DATABASE";
    readonly NODE_ENV: "NODE_ENV";
    readonly CACHE_TTL: "CACHE_TTL";
};
export declare const DATABASE_TYPES: {
    readonly SQLITE: "sqlite";
    readonly POSTGRES: "postgres";
};
