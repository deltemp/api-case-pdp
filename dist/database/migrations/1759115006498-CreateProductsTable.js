"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductsTable1759115006498 = void 0;
class CreateProductsTable1759115006498 {
    name = 'CreateProductsTable1759115006498';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "products" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "brand" character varying(255) NOT NULL,
        "sku" character varying(100) NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "description" text,
        "imageUrl" character varying(500) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "UQ_products_sku" UNIQUE ("sku"),
        CONSTRAINT "PK_products_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_products_sku" ON "products"("sku") WHERE "deletedAt" IS NULL
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_products_brand" ON "products"("brand") WHERE "deletedAt" IS NULL
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_products_created_at" ON "products"("createdAt" DESC)
    `);
        await queryRunner.query(`
      INSERT INTO "products" ("name", "brand", "sku", "price", "description", "imageUrl") VALUES
      ('Sofá 3 Lugares Comfort', 'MóveisTop', 'sf-comfort-3l-bg', 1299.99, 'Sofá confortável de 3 lugares em tecido bege, ideal para sala de estar.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'),
      ('Mesa de Jantar Elegance', 'MadeiraFina', 'mj-elegance-6p-md', 899.50, 'Mesa de jantar em madeira maciça para 6 pessoas, acabamento natural.', 'https://images.unsplash.com/photo-1549497538-303791108f95'),
      ('Cadeira Escritório Pro', 'OfficeMax', 'cd-office-pro-pt', 459.90, 'Cadeira ergonômica para escritório com apoio lombar e regulagem de altura.', 'https://images.unsplash.com/photo-1541558869434-2840d308329a'),
      ('Estante Livros Modern', 'ModernHome', 'et-modern-5p-br', 679.00, 'Estante moderna de 5 prateleiras em MDF branco, ideal para livros e decoração.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d')
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_products_created_at"`);
        await queryRunner.query(`DROP INDEX "idx_products_brand"`);
        await queryRunner.query(`DROP INDEX "idx_products_sku"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }
}
exports.CreateProductsTable1759115006498 = CreateProductsTable1759115006498;
//# sourceMappingURL=1759115006498-CreateProductsTable.js.map