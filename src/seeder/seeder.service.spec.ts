import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { Product } from '../api/products/entities/product.entity';

describe('SeederService', () => {
  let service: SeederService;
  let repository: Repository<Product>;

  const mockRepository = {
    count: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));

    // Mock Logger to avoid console output during tests
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seedProducts', () => {
    it('should skip seeding if products already exist', async () => {
      // Arrange
      mockRepository.count.mockResolvedValue(5);

      // Act
      await service.seedProducts();

      // Assert
      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(Logger.prototype.log).toHaveBeenCalledWith('Starting product seeding...');
      expect(Logger.prototype.log).toHaveBeenCalledWith('Products already exist, skipping seeding');
    });

    it('should seed products when database is empty', async () => {
      // Arrange
      mockRepository.count.mockResolvedValue(0);
      mockRepository.save.mockResolvedValue([]);

      // Act
      await service.seedProducts();

      // Assert
      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith([
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
      ]);
      expect(Logger.prototype.log).toHaveBeenCalledWith('Starting product seeding...');
      expect(Logger.prototype.log).toHaveBeenCalledWith('Successfully seeded 4 products');
    });

    it('should handle database errors during seeding', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockRepository.count.mockResolvedValue(0);
      mockRepository.save.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.seedProducts()).rejects.toThrow('Database connection failed');
      expect(Logger.prototype.error).toHaveBeenCalledWith('Failed to seed products', dbError.stack);
    });

    it('should handle count query errors', async () => {
      // Arrange
      const countError = new Error('Count query failed');
      mockRepository.count.mockRejectedValue(countError);

      // Act & Assert
      await expect(service.seedProducts()).rejects.toThrow('Count query failed');
    });

    it('should seed correct number of products', async () => {
      // Arrange
      mockRepository.count.mockResolvedValue(0);
      mockRepository.save.mockResolvedValue([]);

      // Act
      await service.seedProducts();

      // Assert
      const savedProducts = mockRepository.save.mock.calls[0][0];
      expect(savedProducts).toHaveLength(4);
      expect(savedProducts[0]).toHaveProperty('sku', 'sf-comfort-3l-bg');
      expect(savedProducts[1]).toHaveProperty('sku', 'mj-elegance-6p-md');
      expect(savedProducts[2]).toHaveProperty('sku', 'cd-office-pro-pt');
      expect(savedProducts[3]).toHaveProperty('sku', 'et-moderna-5p-br');
    });

    it('should seed products with correct data structure', async () => {
      // Arrange
      mockRepository.count.mockResolvedValue(0);
      mockRepository.save.mockResolvedValue([]);

      // Act
      await service.seedProducts();

      // Assert
      const savedProducts = mockRepository.save.mock.calls[0][0];
      savedProducts.forEach(product => {
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('brand');
        expect(product).toHaveProperty('sku');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('imageUrl');
        expect(typeof product.price).toBe('number');
        expect(product.price).toBeGreaterThan(0);
      });
    });
  });

  describe('clearProducts', () => {
    it('should clear all products successfully', async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue({ affected: 5 });

      // Act
      await service.clearProducts();

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith({});
      expect(Logger.prototype.log).toHaveBeenCalledWith('Clearing all products...');
      expect(Logger.prototype.log).toHaveBeenCalledWith('All products cleared');
    });

    it('should handle errors during product clearing', async () => {
      // Arrange
      const deleteError = new Error('Delete operation failed');
      mockRepository.delete.mockRejectedValue(deleteError);

      // Act & Assert
      await expect(service.clearProducts()).rejects.toThrow('Delete operation failed');
      expect(Logger.prototype.log).toHaveBeenCalledWith('Clearing all products...');
    });

    it('should clear products even when none exist', async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      // Act
      await service.clearProducts();

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith({});
      expect(Logger.prototype.log).toHaveBeenCalledWith('All products cleared');
    });
  });

  describe('integration scenarios', () => {
    it('should handle seeding after clearing', async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue({ affected: 3 });
      mockRepository.count.mockResolvedValue(0);
      mockRepository.save.mockResolvedValue([]);

      // Act
      await service.clearProducts();
      await service.seedProducts();

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith({});
      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should handle multiple seeding attempts', async () => {
      // Arrange
      mockRepository.count
        .mockResolvedValueOnce(0) // First call - no products
        .mockResolvedValueOnce(4); // Second call - products exist
      mockRepository.save.mockResolvedValue([]);

      // Act
      await service.seedProducts(); // Should seed
      await service.seedProducts(); // Should skip

      // Assert
      expect(mockRepository.count).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});