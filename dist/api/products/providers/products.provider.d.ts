import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductRepository } from '../repositories/product.repository';
export declare const PRODUCTS_PROVIDERS: {
    readonly PRODUCTS_SERVICE: "PRODUCTS_SERVICE";
    readonly PRODUCTS_CONFIG: "PRODUCTS_CONFIG";
};
export declare const productsConfigProvider: Provider;
export declare const productsServiceProvider: Provider;
export declare const productsProviders: (import("@nestjs/common").ClassProvider<any> | import("@nestjs/common").ValueProvider<any> | {
    provide: string;
    useFactory: (dataSource: DataSource) => ProductRepository;
    inject: string[];
})[];
