import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    mockRequest = {
      url: '/test-endpoint',
      method: 'GET',
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;

    // Mock Logger to avoid console output during tests
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle HttpException with string response', () => {
      // Arrange
      const exception = new HttpException('Test error message', HttpStatus.BAD_REQUEST);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test-endpoint',
        method: 'GET',
        error: 'HttpException',
        message: 'Test error message',
      });
    });

    it('should handle HttpException with object response', () => {
      // Arrange
      const exceptionResponse = {
        message: 'Validation failed',
        error: 'Bad Request',
        status: 400,
      };
      const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test-endpoint',
        method: 'GET',
        error: 'Bad Request',
        message: 'Validation failed',
      });
    });

    it('should handle HttpException with complex object response', () => {
      // Arrange
      const exceptionResponse = {
        message: ['field1 is required', 'field2 must be a string'],
        error: 'Validation Error',
      };
      const exception = new HttpException(exceptionResponse, HttpStatus.UNPROCESSABLE_ENTITY);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        timestamp: expect.any(String),
        path: '/test-endpoint',
        method: 'GET',
        error: 'Validation Error',
        message: ['field1 is required', 'field2 must be a string'],
      });
    });

    it('should handle unexpected errors', () => {
      // Arrange
      const unexpectedError = new Error('Unexpected database error');

      // Act
      filter.catch(unexpectedError, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: '/test-endpoint',
        method: 'GET',
        error: 'Internal Server Error',
        message: 'Erro interno do servidor',
      });
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        `Unexpected error: ${unexpectedError}`,
        unexpectedError.stack,
      );
    });

    it('should handle non-Error unexpected exceptions', () => {
      // Arrange
      const unexpectedException = 'String exception';

      // Act
      filter.catch(unexpectedException, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: '/test-endpoint',
        method: 'GET',
        error: 'Internal Server Error',
        message: 'Erro interno do servidor',
      });
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        `Unexpected error: ${unexpectedException}`,
        undefined,
      );
    });

    it('should log 4xx errors as warnings', () => {
      // Arrange
      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(Logger.prototype.warn).toHaveBeenCalledWith(
        'GET /test-endpoint - 404 - "Not Found"',
      );
    });

    it('should log 5xx errors as errors', () => {
      // Arrange
      const exception = new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'GET /test-endpoint - 500 - "Internal Server Error"',
      );
    });

    it('should not log 2xx and 3xx status codes', () => {
      // Arrange
      const exception = new HttpException('OK', HttpStatus.OK);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(Logger.prototype.warn).not.toHaveBeenCalled();
      expect(Logger.prototype.error).not.toHaveBeenCalled();
    });

    it('should handle different request methods and paths', () => {
      // Arrange
      mockRequest.method = 'POST';
      mockRequest.url = '/api/products';
      const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/api/products',
        method: 'POST',
        error: 'HttpException',
        message: 'Bad Request',
      });
    });

    it('should handle HttpException with no error property in response', () => {
      // Arrange
      const exceptionResponse = {
        message: 'Custom message',
        // no error property
      };
      const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test-endpoint',
        method: 'GET',
        error: 'HttpException', // Should fallback to exception.name
        message: 'Custom message',
      });
    });
  });
});