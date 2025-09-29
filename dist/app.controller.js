"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const swagger_1 = require("@nestjs/swagger");
const app_service_1 = require("./app.service");
const seeder_service_1 = require("./seeder/seeder.service");
let AppController = class AppController {
    appService;
    health;
    db;
    seederService;
    constructor(appService, health, db, seederService) {
        this.appService = appService;
        this.health = health;
        this.db = db;
        this.seederService = seederService;
    }
    getDefault(res) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        return res.status(common_1.HttpStatus.NOT_FOUND).json({
            status: 404,
            message: 'Resource not found'
        });
    }
    check() {
        return this.health.check([
            () => this.db.pingCheck('database'),
        ]);
    }
    async seedDatabase() {
        await this.seederService.seedProducts();
        return { message: 'Database seeded successfully' };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Default endpoint',
        description: 'Returns a 404 error for security purposes',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Resource not found',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Resource not found' },
            },
        },
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getDefault", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check',
        description: 'Check the health status of the application and database connection',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "check", null);
__decorate([
    (0, common_1.Post)('seed'),
    (0, swagger_1.ApiOperation)({
        summary: 'Seed database',
        description: 'Populate the database with sample products',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Database seeded successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Database seeded successfully' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seedDatabase", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        terminus_1.HealthCheckService,
        terminus_1.TypeOrmHealthIndicator,
        seeder_service_1.SeederService])
], AppController);
//# sourceMappingURL=app.controller.js.map