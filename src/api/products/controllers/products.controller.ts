import {
  Controller,
  Get,
  Param,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { GetProductDto } from '../dtos/get-product.dto';
import { Product } from '../entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':sku')
  @ApiOperation({
    summary: 'Get product by SKU',
    description: 'Retrieve a product by its SKU (Stock Keeping Unit). Returns cached data when available.',
  })
  @ApiParam({
    name: 'sku',
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'laptop-dell-xps13',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Product found successfully',
    type: Product,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Product with SKU "INVALID-SKU" not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProductBySku(@Param() params: GetProductDto): Promise<Product> {
    return this.productsService.findBySku(params.sku);
  }
}