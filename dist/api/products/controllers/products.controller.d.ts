import { ProductsService } from '../services/products.service';
import { GetProductDto } from '../dtos/get-product.dto';
import { Product } from '../entities/product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getProductBySku(params: GetProductDto): Promise<Product>;
}
