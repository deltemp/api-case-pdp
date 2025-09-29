import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Product } from './product.entity';

describe('Product Entity', () => {
  describe('entity structure', () => {
    it('should create a product instance', () => {
      // Arrange & Act
      const product = new Product();

      // Assert
      expect(product).toBeDefined();
      expect(product).toBeInstanceOf(Product);
    });

    it('should have all required properties', () => {
      // Arrange
      const product = new Product();

      // Assert
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('brand');
      expect(product).toHaveProperty('sku');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('imageUrl');
      expect(product).toHaveProperty('createdAt');
      expect(product).toHaveProperty('updatedAt');
      expect(product).toHaveProperty('deletedAt');
    });

    it('should allow setting all properties', () => {
      // Arrange
      const product = new Product();
      const testData = {
        id: 1,
        name: 'Test Product',
        brand: 'Test Brand',
        sku: 'test-product-123',
        price: 99.99,
        description: 'Test description',
        imageUrl: 'https://example.com/test.jpg',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        deletedAt: null,
      };

      // Act
      Object.assign(product, testData);

      // Assert
      expect(product.id).toBe(testData.id);
      expect(product.name).toBe(testData.name);
      expect(product.brand).toBe(testData.brand);
      expect(product.sku).toBe(testData.sku);
      expect(product.price).toBe(testData.price);
      expect(product.description).toBe(testData.description);
      expect(product.imageUrl).toBe(testData.imageUrl);
      expect(product.createdAt).toEqual(testData.createdAt);
      expect(product.updatedAt).toEqual(testData.updatedAt);
      expect(product.deletedAt).toBe(testData.deletedAt);
    });
  });

  describe('property types and constraints', () => {
    it('should handle numeric id', () => {
      // Arrange
      const product = new Product();

      // Act
      product.id = 12345;

      // Assert
      expect(typeof product.id).toBe('number');
      expect(product.id).toBe(12345);
    });

    it('should handle string name with maximum length', () => {
      // Arrange
      const product = new Product();
      const longName = 'A'.repeat(255);

      // Act
      product.name = longName;

      // Assert
      expect(typeof product.name).toBe('string');
      expect(product.name).toBe(longName);
      expect(product.name.length).toBe(255);
    });

    it('should handle string brand with maximum length', () => {
      // Arrange
      const product = new Product();
      const longBrand = 'B'.repeat(255);

      // Act
      product.brand = longBrand;

      // Assert
      expect(typeof product.brand).toBe('string');
      expect(product.brand).toBe(longBrand);
      expect(product.brand.length).toBe(255);
    });

    it('should handle string sku with maximum length', () => {
      // Arrange
      const product = new Product();
      const longSku = 'c'.repeat(100);

      // Act
      product.sku = longSku;

      // Assert
      expect(typeof product.sku).toBe('string');
      expect(product.sku).toBe(longSku);
      expect(product.sku.length).toBe(100);
    });

    it('should handle decimal price', () => {
      // Arrange
      const product = new Product();
      const testPrices = [0, 0.01, 99.99, 1234.56, 99999999.99];

      for (const price of testPrices) {
        // Act
        product.price = price;

        // Assert
        expect(typeof product.price).toBe('number');
        expect(product.price).toBe(price);
      }
    });

    it('should handle nullable description', () => {
      // Arrange
      const product = new Product();

      // Act & Assert - null description
      product.description = null;
      expect(product.description).toBeNull();

      // Act & Assert - string description
      product.description = 'Test description';
      expect(product.description).toBe('Test description');
    });

    it('should handle imageUrl with maximum length', () => {
      // Arrange
      const product = new Product();
      const longUrl = 'https://example.com/' + 'x'.repeat(481); // Total 500 chars

      // Act
      product.imageUrl = longUrl;

      // Assert
      expect(typeof product.imageUrl).toBe('string');
      expect(product.imageUrl).toBe(longUrl);
      expect(product.imageUrl.length).toBe(longUrl.length);
    });

    it('should handle Date objects for timestamps', () => {
      // Arrange
      const product = new Product();
      const testDate = new Date('2024-01-15T10:30:00Z');

      // Act
      product.createdAt = testDate;
      product.updatedAt = testDate;

      // Assert
      expect(product.createdAt).toBeInstanceOf(Date);
      expect(product.updatedAt).toBeInstanceOf(Date);
      expect(product.createdAt).toEqual(testDate);
      expect(product.updatedAt).toEqual(testDate);
    });

    it('should handle nullable deletedAt', () => {
      // Arrange
      const product = new Product();
      const testDate = new Date('2024-01-15T10:30:00Z');

      // Act & Assert - null deletedAt
      product.deletedAt = null;
      expect(product.deletedAt).toBeNull();

      // Act & Assert - Date deletedAt
      product.deletedAt = testDate;
      expect(product.deletedAt).toBeInstanceOf(Date);
      expect(product.deletedAt).toEqual(testDate);
    });
  });

  describe('data transformation', () => {
    it('should transform plain object to Product instance', () => {
      // Arrange
      const plainObject = {
        id: 1,
        name: 'Laptop Dell XPS 13',
        brand: 'Dell',
        sku: 'laptop-dell-xps13',
        price: 8999.99,
        description: 'High-performance ultrabook',
        imageUrl: 'https://example.com/laptop.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        deletedAt: null,
      };

      // Act
      const product = plainToClass(Product, plainObject);

      // Assert
      expect(product).toBeInstanceOf(Product);
      expect(product.id).toBe(plainObject.id);
      expect(product.name).toBe(plainObject.name);
      expect(product.brand).toBe(plainObject.brand);
      expect(product.sku).toBe(plainObject.sku);
      expect(product.price).toBe(plainObject.price);
      expect(product.description).toBe(plainObject.description);
      expect(product.imageUrl).toBe(plainObject.imageUrl);
    });

    it('should handle array of plain objects', () => {
      // Arrange
      const plainObjects = [
        {
          id: 1,
          name: 'Product 1',
          brand: 'Brand 1',
          sku: 'product-1',
          price: 100.00,
          description: 'Description 1',
          imageUrl: 'https://example.com/1.jpg',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Product 2',
          brand: 'Brand 2',
          sku: 'product-2',
          price: 200.00,
          description: 'Description 2',
          imageUrl: 'https://example.com/2.jpg',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          deletedAt: null,
        },
      ];

      // Act
      const products = plainToClass(Product, plainObjects);

      // Assert
      expect(products).toHaveLength(2);
      products.forEach((product, index) => {
        expect(product).toBeInstanceOf(Product);
        expect(product.id).toBe(plainObjects[index].id);
        expect(product.name).toBe(plainObjects[index].name);
        expect(product.sku).toBe(plainObjects[index].sku);
      });
    });
  });

  describe('edge cases and boundary values', () => {
    it('should handle minimum price value', () => {
      // Arrange
      const product = new Product();

      // Act
      product.price = 0;

      // Assert
      expect(product.price).toBe(0);
    });

    it('should handle maximum precision price', () => {
      // Arrange
      const product = new Product();
      const maxPrice = 99999999.99; // 10 digits total, 2 decimal places

      // Act
      product.price = maxPrice;

      // Assert
      expect(product.price).toBe(maxPrice);
    });

    it('should handle empty string values', () => {
      // Arrange
      const product = new Product();

      // Act
      product.name = '';
      product.brand = '';
      product.sku = '';
      product.imageUrl = '';

      // Assert
      expect(product.name).toBe('');
      expect(product.brand).toBe('');
      expect(product.sku).toBe('');
      expect(product.imageUrl).toBe('');
    });

    it('should handle special characters in string fields', () => {
      // Arrange
      const product = new Product();
      const specialChars = 'Ação & Aventura - Jogo "Especial" (2024) 100%';

      // Act
      product.name = specialChars;
      product.brand = specialChars;
      product.description = specialChars;

      // Assert
      expect(product.name).toBe(specialChars);
      expect(product.brand).toBe(specialChars);
      expect(product.description).toBe(specialChars);
    });

    it('should handle Unicode characters', () => {
      // Arrange
      const product = new Product();
      const unicodeText = '🎮 Gaming Laptop 游戏笔记本 ゲーミングノートPC';

      // Act
      product.name = unicodeText;
      product.description = unicodeText;

      // Assert
      expect(product.name).toBe(unicodeText);
      expect(product.description).toBe(unicodeText);
    });

    it('should handle very long description', () => {
      // Arrange
      const product = new Product();
      const longDescription = 'A'.repeat(10000); // Very long text

      // Act
      product.description = longDescription;

      // Assert
      expect(product.description).toBe(longDescription);
      expect(product.description.length).toBe(10000);
    });
  });

  describe('business logic scenarios', () => {
    it('should represent a complete product for e-commerce', () => {
      // Arrange
      const productData = {
        id: 1,
        name: 'Smartphone Samsung Galaxy S24',
        brand: 'Samsung',
        sku: 'samsung-galaxy-s24-256gb',
        price: 4999.99,
        description: 'Smartphone Samsung Galaxy S24 com 256GB de armazenamento, câmera tripla de 50MP e tela Dynamic AMOLED de 6.2 polegadas.',
        imageUrl: 'https://images.samsung.com/galaxy-s24.jpg',
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-01-15T10:30:00Z'),
        deletedAt: null,
      };

      // Act
      const product = Object.assign(new Product(), productData);

      // Assert
      expect(product.id).toBeGreaterThan(0);
      expect(product.name).toBeTruthy();
      expect(product.brand).toBeTruthy();
      expect(product.sku).toMatch(/^[a-z0-9-]+$/); // SKU format validation
      expect(product.price).toBeGreaterThan(0);
      expect(product.description).toBeTruthy();
      expect(product.imageUrl).toMatch(/^https?:\/\//); // URL format
      expect(product.createdAt).toBeInstanceOf(Date);
      expect(product.updatedAt).toBeInstanceOf(Date);
      expect(product.deletedAt).toBeNull(); // Active product
    });

    it('should represent a soft-deleted product', () => {
      // Arrange
      const product = new Product();
      const deletionDate = new Date('2024-01-20T15:45:00Z');

      // Act
      product.deletedAt = deletionDate;

      // Assert
      expect(product.deletedAt).toEqual(deletionDate);
      expect(product.deletedAt).toBeInstanceOf(Date);
    });

    it('should handle product updates', () => {
      // Arrange
      const product = new Product();
      const originalDate = new Date('2024-01-01T00:00:00Z');
      const updateDate = new Date('2024-01-15T10:30:00Z');

      // Act
      product.createdAt = originalDate;
      product.updatedAt = updateDate;
      product.price = 1999.99;
      product.description = 'Updated description with new features';

      // Assert
      expect(product.createdAt).toEqual(originalDate);
      expect(product.updatedAt).toEqual(updateDate);
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
      expect(product.price).toBe(1999.99);
      expect(product.description).toContain('Updated');
    });
  });

  describe('serialization and deserialization', () => {
    it('should serialize to JSON correctly', () => {
      // Arrange
      const product = new Product();
      Object.assign(product, {
        id: 1,
        name: 'Test Product',
        brand: 'Test Brand',
        sku: 'test-123',
        price: 99.99,
        description: 'Test description',
        imageUrl: 'https://example.com/test.jpg',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        deletedAt: null,
      });

      // Act
      const json = JSON.stringify(product);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.id).toBe(1);
      expect(parsed.name).toBe('Test Product');
      expect(parsed.brand).toBe('Test Brand');
      expect(parsed.sku).toBe('test-123');
      expect(parsed.price).toBe(99.99);
      expect(parsed.description).toBe('Test description');
      expect(parsed.imageUrl).toBe('https://example.com/test.jpg');
      expect(parsed.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(parsed.updatedAt).toBe('2024-01-01T00:00:00.000Z');
      expect(parsed.deletedAt).toBeNull();
    });

    it('should handle JSON with missing optional fields', () => {
      // Arrange
      const minimalJson = {
        id: 1,
        name: 'Minimal Product',
        brand: 'Brand',
        sku: 'minimal-123',
        price: 50.00,
        imageUrl: 'https://example.com/minimal.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      // Act
      const product = plainToClass(Product, minimalJson);

      // Assert
      expect(product.id).toBe(1);
      expect(product.name).toBe('Minimal Product');
      expect(product.description).toBeUndefined();
      expect(product.deletedAt).toBeUndefined();
    });
  });
});