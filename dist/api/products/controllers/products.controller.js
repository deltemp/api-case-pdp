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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("../services/products.service");
const get_product_dto_1 = require("../dtos/get-product.dto");
const product_entity_1 = require("../entities/product.entity");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async getProductBySku(params) {
        return this.productsService.findBySku(params.sku);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(':sku'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product by SKU',
        description: 'Retrieve a product by its SKU (Stock Keeping Unit). Returns cached data when available.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'sku',
        description: 'Product SKU (Stock Keeping Unit)',
        example: 'laptop-dell-xps13',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product found successfully',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Product not found',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Product with SKU "INVALID-SKU" not found' },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_product_dto_1.GetProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductBySku", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map