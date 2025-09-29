import { Repository } from 'typeorm';
import { Product } from '../api/products/entities/product.entity';
export declare class SeederService {
    private readonly productRepository;
    private readonly logger;
    constructor(productRepository: Repository<Product>);
    seedProducts(): Promise<void>;
    clearProducts(): Promise<void>;
}
