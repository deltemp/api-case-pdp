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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Product = class Product {
    id;
    name;
    brand;
    sku;
    price;
    description;
    imageUrl;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.Product = Product;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the product',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'Sofá 3 Lugares Comfort',
        maxLength: 255,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product brand',
        example: 'MóveisTop',
        maxLength: 255,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product SKU (Stock Keeping Unit)',
        example: 'sf-comfort-3l-bg',
        maxLength: 100,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product price in decimal format',
        example: 1299.99,
        type: 'number',
        format: 'decimal',
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product description',
        example: 'Sofá confortável de 3 lugares em tecido bege, ideal para sala de estar.',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product image URL',
        example: 'https://example.com/images/sofa-comfort-3l-bg.jpg',
        maxLength: 500,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product creation timestamp',
        example: '2024-01-15T10:30:00Z',
        type: 'string',
        format: 'date-time',
    }),
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product last update timestamp',
        example: '2024-01-15T10:30:00Z',
        type: 'string',
        format: 'date-time',
    }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product deletion timestamp (soft delete)',
        example: null,
        nullable: true,
        type: 'string',
        format: 'date-time',
    }),
    (0, typeorm_1.DeleteDateColumn)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "deletedAt", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products'),
    (0, typeorm_1.Index)('idx_products_sku', ['sku'], { where: '"deletedAt" IS NULL' }),
    (0, typeorm_1.Index)('idx_products_brand', ['brand'], { where: '"deletedAt" IS NULL' }),
    (0, typeorm_1.Index)('idx_products_created_at', ['createdAt'])
], Product);
//# sourceMappingURL=product.entity.js.map