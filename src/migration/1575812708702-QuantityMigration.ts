import {MigrationInterface, QueryRunner} from "typeorm";

export class QuantityMigration1575812708702 implements MigrationInterface {
  public name = "QuantityMigration1575812708702";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "article" ADD "saleUnit" numeric(10,1) NOT NULL DEFAULT 1`, undefined);

    await queryRunner.query(`ALTER TABLE "article_check_out" RENAME "quantity" to "quantity-orig"`);
    await queryRunner.query(`ALTER TABLE "article_check_out" ADD "quantity" numeric(10,1)`, undefined);
    await queryRunner.query(`UPDATE "article_check_out" SET "quantity" = CAST("quantity-orig" AS NUMERIC)`, undefined);
    await queryRunner.query(`ALTER TABLE "article_check_out" DROP COLUMN "quantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "article_check_out" ALTER COLUMN "quantity" SET NOT NULL`, undefined);

    await queryRunner.query(`ALTER TABLE "order_item" RENAME "quantity" to "quantity-orig"`);
    await queryRunner.query(`ALTER TABLE "order_item" ADD "quantity" numeric(10,1)`, undefined);
    await queryRunner.query(`UPDATE "order_item" SET "quantity" = CAST("quantity-orig" AS NUMERIC)`, undefined);
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "quantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "order_item" ALTER COLUMN "quantity" SET NOT NULL`, undefined);

    await queryRunner.query(`ALTER TABLE "article_stock" RENAME "quantity" to "quantity-orig"`);
    await queryRunner.query(`ALTER TABLE "article_stock" ADD "quantity" numeric(10,1)`, undefined);
    await queryRunner.query(`UPDATE "article_stock" SET "quantity" = CAST("quantity-orig" AS NUMERIC)`, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" DROP COLUMN "quantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "quantity" SET NOT NULL`, undefined);

    await queryRunner.query(`ALTER TABLE "article_stock" RENAME "reservedQuantity" to "reservedQuantity-orig"`);
    await queryRunner.query(`ALTER TABLE "article_stock" ADD "reservedQuantity" numeric(10,1)`, undefined);
    await queryRunner.query(`UPDATE "article_stock" SET "reservedQuantity" = CAST("reservedQuantity-orig" AS NUMERIC)`, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" DROP COLUMN "reservedQuantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "reservedQuantity" SET NOT NULL`, undefined);

    await queryRunner.query(`ALTER TABLE "article_check_in" RENAME "quantity" to "quantity-orig"`);
    await queryRunner.query(`ALTER TABLE "article_check_in" ADD "quantity" numeric(10,1)`, undefined);
    await queryRunner.query(`UPDATE "article_check_in" SET "quantity" = CAST("quantity-orig" AS NUMERIC)`, undefined);
    await queryRunner.query(`ALTER TABLE "article_check_in" DROP COLUMN "quantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "article_check_in" ALTER COLUMN "quantity" SET NOT NULL`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "article_check_in" RENAME "quantity" to "quantity-orig"`);
    await queryRunner.query(`ALTER TABLE "article_check_in" ADD "quantity" integer`, undefined);
    await queryRunner.query(`UPDATE "article_check_in" SET "quantity" = CAST("quantity-orig" AS INTEGER)`, undefined);
    await queryRunner.query(`ALTER TABLE "article_check_in" DROP COLUMN "quantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "article_check_in" ALTER COLUMN "quantity" SET NOT NULL`, undefined);

    await queryRunner.query(`ALTER TABLE "article_stock" RENAME "reservedQuantity" to "reservedQuantity-orig"`);
    await queryRunner.query(`ALTER TABLE "article_stock" ADD "reservedQuantity" integer`, undefined);
    await queryRunner.query(`UPDATE "article_stock" SET "reservedQuantity" = CAST("reservedQuantity-orig" AS INTEGER)`, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" DROP COLUMN "reservedQuantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "reservedQuantity" SET NOT NULL`, undefined);

    await queryRunner.query(`ALTER TABLE "article_stock" RENAME "quantity" to "quantity-orig"`);
    await queryRunner.query(`ALTER TABLE "article_stock" ADD "quantity" integer`, undefined);
    await queryRunner.query(`UPDATE "article_stock" SET "quantity" = CAST("quantity-orig" AS INTEGER)`, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" DROP COLUMN "quantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "quantity" SET NOT NULL`, undefined);

    await queryRunner.query(`ALTER TABLE "order_item" RENAME "quantity" to "quantity-orig"`);
    await queryRunner.query(`ALTER TABLE "order_item" ADD "quantity" integer`, undefined);
    await queryRunner.query(`UPDATE "order_item" SET "quantity" = CAST("quantity-orig" AS INTEGER)`, undefined);
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "quantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "order_item" ALTER COLUMN "quantity" SET NOT NULL`, undefined);

    await queryRunner.query(`ALTER TABLE "article_check_out" RENAME "quantity" to "quantity-orig"`);
    await queryRunner.query(`ALTER TABLE "article_check_out" ADD "quantity" integer`, undefined);
    await queryRunner.query(`UPDATE "article_check_out" SET "quantity" = CAST("quantity-orig" AS INTEGER)`, undefined);
    await queryRunner.query(`ALTER TABLE "article_check_out" DROP COLUMN "quantity-orig"`, undefined);
    await queryRunner.query(`ALTER TABLE "article_check_out" ALTER COLUMN "quantity" SET NOT NULL`, undefined);

    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "saleUnit"`, undefined);
  }
}
