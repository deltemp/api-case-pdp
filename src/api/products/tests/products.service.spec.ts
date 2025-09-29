import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;
  let cacheManager: Cache;

  const mockProduct: Product = {
    id: 1,
    sku: 'laptop-dell-xps13',
    name: 'Laptop Dell XPS 13',
    description: 'Ultrabook Dell XPS 13 com processador Intel Core i7',
    price: 8999.99,
    brand: 'Dell',
    imageUrl: 'https://example.com/laptop-dell-xps13.jpg',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    deletedAt: null,
  };

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findBySku', () => {
    const sku = 'laptop-dell-xps13';
    const cacheKey = `product:${sku}`;

    it('should return cached product if available', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(mockProduct);

      // Act
      const result = await service.findBySku(sku);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.findOne).not.toHaveBeenCalled();
      expect(mockCacheManager.set).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if not in cache', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      const result = await service.findBySku(sku);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { sku, deletedAt: IsNull() } });
      expect(mockCacheManager.set).toHaveBeenCalledWith(cacheKey, mockProduct, 60000);
    });

    it('should throw NotFoundException if product not found', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findBySku(sku)).rejects.toThrow(NotFoundException);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { sku, deletedAt: IsNull() } });
      expect(mockCacheManager.set).not.toHaveBeenCalled();
    });

    it('should handle cache errors gracefully and still fetch from database', async () => {
      // Arrange
      const cacheError = new Error('Cache connection failed');
      mockCacheManager.get.mockRejectedValue(cacheError);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      const result = await service.findBySku(sku);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { sku, deletedAt: IsNull() } });
      expect(mockCacheManager.set).toHaveBeenCalledWith(cacheKey, mockProduct, 60000);
    });

    it('should handle cache set errors gracefully', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      const cacheSetError = new Error('Cache set failed');
      mockCacheManager.set.mockRejectedValue(cacheSetError);

      // Act
      const result = await service.findBySku(sku);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { sku, deletedAt: IsNull() } });
      expect(mockCacheManager.set).toHaveBeenCalledWith(cacheKey, mockProduct, 60000);
    });

    it('should handle database errors', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(null);
      const dbError = new Error('Database connection failed');
      mockRepository.findOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findBySku(sku)).rejects.toThrow('Database connection failed');
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { sku, deletedAt: IsNull() } });
    });

    it('should use correct cache TTL (5 minutes)', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      await service.findBySku(sku);

      // Assert
      expect(mockCacheManager.set).toHaveBeenCalledWith(cacheKey, mockProduct, 60000); // 5 minutes in ms
    });

    it('should handle empty string SKU', async () => {
      // Arrange
      const emptySku = '';
      const emptyCacheKey = `product:${emptySku}`;
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findBySku(emptySku)).rejects.toThrow(NotFoundException);
      expect(mockCacheManager.get).toHaveBeenCalledWith(emptyCacheKey);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { sku: emptySku, deletedAt: IsNull() } });
    });

    it('should handle special characters in SKU', async () => {
      // Arrange
      const specialSku = 'product-with-special-chars-123';
      const specialCacheKey = `product:${specialSku}`;
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      const result = await service.findBySku(specialSku);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(mockCacheManager.get).toHaveBeenCalledWith(specialCacheKey);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { sku: specialSku, deletedAt: IsNull() } });
    });

    it('should handle concurrent requests for same SKU', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      const promises = [
        service.findBySku(sku),
        service.findBySku(sku),
        service.findBySku(sku),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual(mockProduct);
      });
      expect(mockCacheManager.get).toHaveBeenCalledTimes(3);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(3);
    });

    it('should handle null response from cache correctly', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      const result = await service.findBySku(sku);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { sku, deletedAt: IsNull() } });
    });

    it('should handle undefined response from cache correctly', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      const result = await service.findBySku(sku);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { sku, deletedAt: IsNull() } });
    });
  });

  describe('service initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have repository injected', () => {
      expect(repository).toBeDefined();
    });

    it('should have cache manager injected', () => {
      expect(cacheManager).toBeDefined();
    });
  });

  describe('error handling scenarios', () => {
    it('should handle repository connection timeout', async () => {
      // Arrange
      const sku = 'test-sku';
      mockCacheManager.get.mockResolvedValue(null);
      const timeoutError = new Error('Connection timeout');
      timeoutError.name = 'TimeoutError';
      mockRepository.findOne.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(service.findBySku(sku)).rejects.toThrow('Connection timeout');
    });

    it('should handle cache manager unavailable', async () => {
      // Arrange
      const sku = 'test-sku';
      const unavailableError = new Error('Cache service unavailable');
      mockCacheManager.get.mockRejectedValue(unavailableError);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      const result = await service.findBySku(sku);

      // Assert
      expect(result).toEqual(mockProduct);
    });

    it('should handle malformed cache data', async () => {
      // Arrange
      const sku = 'test-sku';
      const malformedData = { invalid: 'data' };
      mockCacheManager.get.mockResolvedValue(malformedData);

      // Act
      const result = await service.findBySku(sku);

      // Assert
      expect(result).toEqual(malformedData);
    });
  });

  describe('performance and caching behavior', () => {
    it('should not call database when cache hit occurs', async () => {
      // Arrange
      const sku = 'cached-product';
      mockCacheManager.get.mockResolvedValue(mockProduct);

      // Act
      await service.findBySku(sku);

      // Assert
      expect(mockRepository.findOne).not.toHaveBeenCalled();
      expect(mockCacheManager.set).not.toHaveBeenCalled();
    });

    it('should cache product after database fetch', async () => {
      // Arrange
      const sku = 'new-product';
      const cacheKey = `product:${sku}`;
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      await service.findBySku(sku);

      // Assert
      expect(mockCacheManager.set).toHaveBeenCalledWith(cacheKey, mockProduct, 60000);
    });

    it('should handle cache key generation correctly', async () => {
      // Arrange
      const testSkus = ['simple', 'with-hyphens', 'with123numbers'];
      mockCacheManager.get.mockResolvedValue(mockProduct);

      // Act
      for (const sku of testSkus) {
        await service.findBySku(sku);
      }

      // Assert
      expect(mockCacheManager.get).toHaveBeenCalledWith('product:simple');
      expect(mockCacheManager.get).toHaveBeenCalledWith('product:with-hyphens');
      expect(mockCacheManager.get).toHaveBeenCalledWith('product:with123numbers');
    });
  });
});