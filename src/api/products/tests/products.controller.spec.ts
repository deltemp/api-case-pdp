import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsController } from '../controllers/products.controller';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct: Product = {
    id: 1,
    name: 'Sofá 3 Lugares Comfort',
    brand: 'MóveisTop',
    sku: 'sf-comfort-3l-bg',
    price: 1299.99,
    description: 'Sofá confortável de 3 lugares em tecido bege, ideal para sala de estar.',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    deletedAt: null,
  };

  const mockProductsService = {
    findBySku: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProductBySku', () => {
    it('should return a product when found', async () => {
      // Arrange
      const sku = 'sf-comfort-3l-bg';
      mockProductsService.findBySku.mockResolvedValue(mockProduct);

      // Act
      const result = await controller.getProductBySku({ sku });

      // Assert
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.findBySku).toHaveBeenCalledWith(sku);
    });

    it('should throw NotFoundException when product not found', async () => {
      // Arrange
      const sku = 'non-existent-sku';
      mockProductsService.findBySku.mockRejectedValue(
        new NotFoundException('Produto não encontrado'),
      );

      // Act & Assert
      await expect(controller.getProductBySku({ sku })).rejects.toThrow(
        new NotFoundException('Produto não encontrado'),
      );
      expect(mockProductsService.findBySku).toHaveBeenCalledWith(sku);
    });

    it('should handle invalid SKU format', async () => {
      // Arrange
      const sku = 'invalid-sku-format';
      mockProductsService.findBySku.mockRejectedValue(
        new NotFoundException('Produto não encontrado'),
      );

      // Act & Assert
      await expect(controller.getProductBySku({ sku })).rejects.toThrow(
        new NotFoundException('Produto não encontrado'),
      );
    });
  });
});