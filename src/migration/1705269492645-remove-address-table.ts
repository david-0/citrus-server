import {MigrationInterface, QueryRunner} from "typeorm";

export class schemaMigration1705269492645 implements MigrationInterface {
    name = 'removeAddressTable1705269492645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "visible" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "visible" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT false`);
    }

}
