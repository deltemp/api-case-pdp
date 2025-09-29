import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductDto {
  @ApiProperty({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'laptop-dell-xps13',
    pattern: '^[a-z0-9-]+$',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'SKU deve conter apenas letras minúsculas, números e hífens',
  })
  sku: string;
}