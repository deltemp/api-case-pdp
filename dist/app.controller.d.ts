import type { Response } from 'express';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { AppService } from './app.service';
import { SeederService } from './seeder/seeder.service';
export declare class AppController {
    private readonly appService;
    private readonly health;
    private readonly db;
    private readonly seederService;
    constructor(appService: AppService, health: HealthCheckService, db: TypeOrmHealthIndicator, seederService: SeederService);
    getDefault(res: Response): Response<any, Record<string, any>>;
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    seedDatabase(): Promise<{
        message: string;
    }>;
}
