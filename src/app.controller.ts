import { Controller, Get, Post, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { SeederService } from './seeder/seeder.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly seederService: SeederService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Default endpoint',
    description: 'Returns a 404 error for security purposes',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Resource not found' },
      },
    },
  })
  getDefault(@Res() res: Response) {
    // Set security headers to prevent information leakage
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(HttpStatus.NOT_FOUND).json({
      status: 404,
      message: 'Resource not found'
    });
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Check the health status of the application and database connection',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
          },
        },
        error: { type: 'object' },
        details: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
          },
        },
      },
    },
  })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Post('seed')
  @ApiOperation({
    summary: 'Seed database',
    description: 'Populate the database with sample products',
  })
  @ApiResponse({
    status: 200,
    description: 'Database seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Database seeded successfully' },
      },
    },
  })
  async seedDatabase() {
    await this.seederService.seedProducts();
    return { message: 'Database seeded successfully' };
  }
}
