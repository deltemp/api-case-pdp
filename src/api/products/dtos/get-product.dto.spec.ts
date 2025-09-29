import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GetProductDto } from './get-product.dto';

describe('GetProductDto', () => {
  describe('validation', () => {
    it('should pass validation with valid SKU', async () => {
      // Arrange
      const validSkus = [
        'laptop-dell-xps13',
        'sf-comfort-3l-bg',
        'mj-elegance-6p-md',
        'cd-office-pro-pt',
        'et-moderna-5p-br',
        'simple-sku',
        'sku123',
        '123-456-789',
        'a',
        'a-b-c-d-e-f-g-h-i-j-k-l-m-n-o-p-q-r-s-t-u-v-w-x-y-z-0-1-2-3-4-5-6-7-8-9',
      ];

      for (const sku of validSkus) {
        const dto = plainToClass(GetProductDto, { sku });

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should fail validation with empty SKU', async () => {
      // Arrange
      const dto = plainToClass(GetProductDto, { sku: '' });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('sku');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with null SKU', async () => {
      // Arrange
      const dto = plainToClass(GetProductDto, { sku: null });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('sku');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation with undefined SKU', async () => {
      // Arrange
      const dto = plainToClass(GetProductDto, {});

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('sku');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation with non-string SKU', async () => {
      // Arrange
      const invalidValues = [123, true, [], {}, new Date()];

      for (const sku of invalidValues) {
        const dto = plainToClass(GetProductDto, { sku });

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('sku');
        expect(errors[0].constraints).toHaveProperty('isString');
      }
    });

    it('should fail validation with uppercase letters in SKU', async () => {
      // Arrange
      const invalidSkus = [
        'LAPTOP-DELL-XPS13',
        'Laptop-Dell-Xps13',
        'laptop-DELL-xps13',
        'A',
        'sku-WITH-UPPERCASE',
      ];

      for (const sku of invalidSkus) {
        const dto = plainToClass(GetProductDto, { sku });

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('sku');
        expect(errors[0].constraints).toHaveProperty('matches');
        expect(errors[0].constraints?.matches).toBe('SKU deve conter apenas letras minúsculas, números e hífens');
      }
    });

    it('should fail validation with special characters in SKU', async () => {
      // Arrange
      const invalidSkus = [
        'laptop_dell_xps13',
        'laptop.dell.xps13',
        'laptop@dell#xps13',
        'laptop dell xps13',
        'laptop+dell+xps13',
        'laptop/dell/xps13',
        'laptop\\dell\\xps13',
        'laptop&dell&xps13',
        'laptop%dell%xps13',
        'laptop*dell*xps13',
        'laptop(dell)xps13',
        'laptop[dell]xps13',
        'laptop{dell}xps13',
        'laptop|dell|xps13',
        'laptop^dell^xps13',
        'laptop~dell~xps13',
        'laptop`dell`xps13',
        'laptop\'dell\'xps13',
        'laptop"dell"xps13',
        'laptop;dell;xps13',
        'laptop:dell:xps13',
        'laptop,dell,xps13',
        'laptop<dell>xps13',
        'laptop?dell?xps13',
        'laptop!dell!xps13',
        'laptop=dell=xps13',
      ];

      for (const sku of invalidSkus) {
        const dto = plainToClass(GetProductDto, { sku });

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('sku');
        expect(errors[0].constraints).toHaveProperty('matches');
        expect(errors[0].constraints?.matches).toBe('SKU deve conter apenas letras minúsculas, números e hífens');
      }
    });

    it('should pass validation with only lowercase letters', async () => {
      // Arrange
      const dto = plainToClass(GetProductDto, { sku: 'abcdefghijklmnopqrstuvwxyz' });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only numbers', async () => {
      // Arrange
      const dto = plainToClass(GetProductDto, { sku: '1234567890' });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only hyphens', async () => {
      // Arrange
      const dto = plainToClass(GetProductDto, { sku: '---' });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with mixed valid characters', async () => {
      // Arrange
      const dto = plainToClass(GetProductDto, { sku: 'abc-123-def-456' });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with single character SKU', async () => {
      // Arrange
      const validSingleChars = ['a', 'z', '0', '9', '-'];

      for (const sku of validSingleChars) {
        const dto = plainToClass(GetProductDto, { sku });

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should handle edge cases with consecutive hyphens', async () => {
      // Arrange
      const dto = plainToClass(GetProductDto, { sku: 'sku--with--double--hyphens' });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should handle edge cases with leading and trailing hyphens', async () => {
      // Arrange
      const validSkus = ['-sku', 'sku-', '-sku-', '--sku--'];

      for (const sku of validSkus) {
        const dto = plainToClass(GetProductDto, { sku });

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should validate multiple constraints simultaneously', async () => {
      // Arrange - empty string violates both isNotEmpty and matches
      const dto = plainToClass(GetProductDto, { sku: '' });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('sku');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      // Note: matches constraint might not be checked if isNotEmpty fails first
    });

    it('should validate with whitespace-only SKU', async () => {
      // Arrange
      const dto = plainToClass(GetProductDto, { sku: '   ' });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('sku');
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });

  describe('DTO properties', () => {
    it('should have correct property name', () => {
      // Arrange
      const dto = new GetProductDto();
      dto.sku = 'test-sku';

      // Assert
      expect(dto).toHaveProperty('sku');
      expect(dto.sku).toBe('test-sku');
    });

    it('should be assignable', () => {
      // Arrange & Act
      const dto = new GetProductDto();
      dto.sku = 'new-sku-value';

      // Assert
      expect(dto.sku).toBe('new-sku-value');
    });
  });
});