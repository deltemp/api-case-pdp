import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheckResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeederService } from './seeder/seeder.service';

describe('AppController', () => {
  let appController: AppController;
  let healthCheckService: HealthCheckService;
  let typeOrmHealthIndicator: TypeOrmHealthIndicator;
  let seederService: SeederService;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockTypeOrmHealthIndicator = {
    pingCheck: jest.fn(),
  };

  const mockSeederService = {
    seedProducts: jest.fn(),
  };

  const mockResponse = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: mockTypeOrmHealthIndicator,
        },
        {
          provide: SeederService,
          useValue: mockSeederService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    healthCheckService = app.get<HealthCheckService>(HealthCheckService);
    typeOrmHealthIndicator = app.get<TypeOrmHealthIndicator>(TypeOrmHealthIndicator);
    seederService = app.get<SeederService>(SeederService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('should return 404 error with security headers', () => {
      // Act
      appController.getDefault(mockResponse as any);

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache, no-store, must-revalidate');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Pragma', 'no-cache');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Expires', '0');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 404,
        message: 'Resource not found'
      });
    });

    it('should set all security headers correctly', () => {
      // Act
      appController.getDefault(mockResponse as any);

      // Assert - Verify all security headers are set
      expect(mockResponse.setHeader).toHaveBeenCalledTimes(6);
      expect(mockResponse.setHeader).toHaveBeenNthCalledWith(1, 'X-Content-Type-Options', 'nosniff');
      expect(mockResponse.setHeader).toHaveBeenNthCalledWith(2, 'X-Frame-Options', 'DENY');
      expect(mockResponse.setHeader).toHaveBeenNthCalledWith(3, 'X-XSS-Protection', '1; mode=block');
      expect(mockResponse.setHeader).toHaveBeenNthCalledWith(4, 'Cache-Control', 'no-cache, no-store, must-revalidate');
      expect(mockResponse.setHeader).toHaveBeenNthCalledWith(5, 'Pragma', 'no-cache');
      expect(mockResponse.setHeader).toHaveBeenNthCalledWith(6, 'Expires', '0');
    });

    it('should handle response object without throwing errors', () => {
      // Arrange
      const minimalResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Act & Assert
      expect(() => appController.getDefault(minimalResponse as any)).not.toThrow();
    });
  });

  describe('health check', () => {
    it('should return health check result when database is healthy', async () => {
      // Arrange
      const mockHealthResult: HealthCheckResult = {
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
        },
      };
      mockHealthCheckService.check.mockResolvedValue(mockHealthResult);

      // Act
      const result = await appController.check();

      // Assert
      expect(result).toEqual(mockHealthResult);
      expect(mockHealthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
    });

    it('should return health check result when database is down', async () => {
      // Arrange
      const mockHealthResult: HealthCheckResult = {
        status: 'error',
        info: {},
        error: {
          database: {
            status: 'down',
            message: 'Connection failed',
          },
        },
        details: {
          database: {
            status: 'down',
            message: 'Connection failed',
          },
        },
      };
      mockHealthCheckService.check.mockResolvedValue(mockHealthResult);

      // Act
      const result = await appController.check();

      // Assert
      expect(result).toEqual(mockHealthResult);
      expect(mockHealthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
    });

    it('should handle health check service errors', async () => {
      // Arrange
      const healthCheckError = new HealthCheckError('Health check failed', {
        database: {
          status: 'down',
          message: 'Database connection timeout',
        },
      });
      mockHealthCheckService.check.mockRejectedValue(healthCheckError);

      // Act & Assert
      await expect(appController.check()).rejects.toThrow(HealthCheckError);
      expect(mockHealthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
    });

    it('should call database ping check with correct parameters', async () => {
      // Arrange
      const mockHealthResult: HealthCheckResult = {
        status: 'ok',
        info: { database: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' } },
      };
      mockHealthCheckService.check.mockImplementation((checks) => {
        // Execute the check function to verify it calls pingCheck
        const checkFunction = checks[0];
        checkFunction();
        return Promise.resolve(mockHealthResult);
      });

      // Act
      await appController.check();

      // Assert
      expect(mockTypeOrmHealthIndicator.pingCheck).toHaveBeenCalledWith('database');
    });
  });

  describe('seed database', () => {
    it('should seed database successfully', async () => {
      // Arrange
      mockSeederService.seedProducts.mockResolvedValue(undefined);

      // Act
      const result = await appController.seedDatabase();

      // Assert
      expect(result).toEqual({ message: 'Database seeded successfully' });
      expect(mockSeederService.seedProducts).toHaveBeenCalledTimes(1);
      expect(mockSeederService.seedProducts).toHaveBeenCalledWith();
    });

    it('should handle seeder service errors', async () => {
      // Arrange
      const seedError = new Error('Failed to seed database');
      mockSeederService.seedProducts.mockRejectedValue(seedError);

      // Act & Assert
      await expect(appController.seedDatabase()).rejects.toThrow('Failed to seed database');
      expect(mockSeederService.seedProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle seeder service timeout', async () => {
      // Arrange
      const timeoutError = new Error('Seeding operation timed out');
      mockSeederService.seedProducts.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(appController.seedDatabase()).rejects.toThrow('Seeding operation timed out');
    });

    it('should return consistent message format', async () => {
      // Arrange
      mockSeederService.seedProducts.mockResolvedValue(undefined);

      // Act
      const result = await appController.seedDatabase();

      // Assert
      expect(result).toHaveProperty('message');
      expect(typeof result.message).toBe('string');
      expect(result.message).toBe('Database seeded successfully');
    });
  });

  describe('constructor and dependencies', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should have all required dependencies injected', () => {
      expect(healthCheckService).toBeDefined();
      expect(typeOrmHealthIndicator).toBeDefined();
      expect(seederService).toBeDefined();
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple concurrent health checks', async () => {
      // Arrange
      const mockHealthResult: HealthCheckResult = {
        status: 'ok',
        info: { database: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' } },
      };
      mockHealthCheckService.check.mockResolvedValue(mockHealthResult);

      // Act
      const promises = [
        appController.check(),
        appController.check(),
        appController.check(),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual(mockHealthResult);
      });
      expect(mockHealthCheckService.check).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple concurrent seed operations', async () => {
      // Arrange
      mockSeederService.seedProducts.mockResolvedValue(undefined);

      // Act
      const promises = [
        appController.seedDatabase(),
        appController.seedDatabase(),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(2);
      results.forEach(result => {
        expect(result).toEqual({ message: 'Database seeded successfully' });
      });
      expect(mockSeederService.seedProducts).toHaveBeenCalledTimes(2);
    });
  });
});
