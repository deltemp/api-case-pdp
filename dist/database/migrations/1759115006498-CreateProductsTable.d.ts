import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateProductsTable1759115006498 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
