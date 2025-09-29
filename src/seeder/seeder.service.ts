import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../api/products/entities/product.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async seedProducts(): Promise<void> {
    this.logger.log('Starting product seeding...');

    const existingProducts = await this.productRepository.count();
    if (existingProducts > 0) {
      this.logger.log('Products already exist, skipping seeding');
      return;
    }

    const sampleProducts = [
      {
        name: 'Sofá 3 Lugares Comfort',
        brand: 'MóveisTop',
        sku: 'sf-comfort-3l-bg',
        price: 1299.99,
        description: 'Sofá confortável de 3 lugares em tecido bege, ideal para sala de estar.',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
      },
      {
        name: 'Mesa de Jantar Elegance',
        brand: 'MadeiraFina',
        sku: 'mj-elegance-6p-md',
        price: 899.50,
        description: 'Mesa de jantar em madeira maciça para 6 pessoas, acabamento natural.',
        imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95',
      },
      {
        name: 'Cadeira Office Pro',
        brand: 'ErgoCorp',
        sku: 'cd-office-pro-pt',
        price: 450.00,
        description: 'Cadeira ergonômica para escritório com apoio lombar e regulagem de altura.',
        imageUrl: 'https://images.unsplash.com/photo-1541558869434-2840d308329a',
      },
      {
        name: 'Estante Moderna Style',
        brand: 'DesignHome',
        sku: 'et-moderna-5p-br',
        price: 320.75,
        description: 'Estante moderna de 5 prateleiras em MDF branco, ideal para livros e decoração.',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
      },
    ];

    try {
      await this.productRepository.save(sampleProducts);
      this.logger.log(`Successfully seeded ${sampleProducts.length} products`);
    } catch (error) {
      this.logger.error('Failed to seed products', error.stack);
      throw error;
    }
  }

  async clearProducts(): Promise<void> {
    this.logger.log('Clearing all products...');
    await this.productRepository.delete({});
    this.logger.log('All products cleared');
  }
}