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
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../api/products/entities/product.entity");
let SeederService = SeederService_1 = class SeederService {
    productRepository;
    logger = new common_1.Logger(SeederService_1.name);
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async seedProducts() {
        this.logger.log('Starting product seeding...');
        const existingProducts = await this.productRepository.count();
        if (existingProducts > 0) {
            this.logger.log('Products already exist, skipping seeding');
            return;
        }
        const sampleProducts = [
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
        ];
        try {
            await this.productRepository.save(sampleProducts);
            this.logger.log(`Successfully seeded ${sampleProducts.length} products`);
        }
        catch (error) {
            this.logger.error('Failed to seed products', error.stack);
            throw error;
        }
    }
    async clearProducts() {
        this.logger.log('Clearing all products...');
        await this.productRepository.delete({});
        this.logger.log('All products cleared');
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SeederService);
//# sourceMappingURL=seeder.service.js.map