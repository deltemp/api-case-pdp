import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
@Index('idx_products_sku', ['sku'], { where: '"deletedAt" IS NULL' })
@Index('idx_products_brand', ['brand'], { where: '"deletedAt" IS NULL' })
@Index('idx_products_created_at', ['createdAt'])
export class Product {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Product name',
    example: 'Sofá 3 Lugares Comfort',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Product brand',
    example: 'MóveisTop',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  brand: string;

  @ApiProperty({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'sf-comfort-3l-bg',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  sku: string;

  @ApiProperty({
    description: 'Product price in decimal format',
    example: 1299.99,
    type: 'number',
    format: 'decimal',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'Sofá confortável de 3 lugares em tecido bege, ideal para sala de estar.',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/images/sofa-comfort-3l-bg.jpg',
    maxLength: 500,
  })
  @Column({ type: 'varchar', length: 500, nullable: false })
  imageUrl: string;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update timestamp',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Product deletion timestamp (soft delete)',
    example: null,
    nullable: true,
    type: 'string',
    format: 'date-time',
  })
  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt: Date | null;
}