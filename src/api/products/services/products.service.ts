import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly CACHE_TTL = 60000; // 60 seconds

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findBySku(sku: string): Promise<Product> {
    const cacheKey = `product:${sku}`;

    try {
      // Try to get from cache first
      const cachedProduct = await this.cacheManager.get<Product>(cacheKey);
      if (cachedProduct) {
        this.logger.debug(`Product found in cache: ${sku}`);
        return cachedProduct;
      }
    } catch (error) {
      this.logger.warn(`Cache error for SKU ${sku}: ${error.message}`);
    }

    // If not in cache, fetch from database
    const product = await this.productRepository.findOne({
      where: { sku, deletedAt: IsNull() },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Cache the result
    try {
      await this.cacheManager.set(cacheKey, product, this.CACHE_TTL);
      this.logger.debug(`Product cached: ${sku}`);
    } catch (error) {
      this.logger.warn(`Failed to cache product ${sku}: ${error.message}`);
    }

    return product;
  }
}