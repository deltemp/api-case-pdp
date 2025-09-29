import type { Cache } from 'cache-manager';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
export declare class ProductsService {
    private readonly productRepository;
    private readonly cacheManager;
    private readonly logger;
    private readonly CACHE_TTL;
    constructor(productRepository: ProductRepository, cacheManager: Cache);
    findBySku(sku: string): Promise<Product>;
}
