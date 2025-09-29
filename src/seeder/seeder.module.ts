import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Product } from '../api/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}