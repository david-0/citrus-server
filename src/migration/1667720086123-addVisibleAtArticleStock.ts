import {MigrationInterface, QueryRunner} from "typeorm";

export class addVisibleAtArticleStock1667720086123 implements MigrationInterface {
    name = 'addVisibleAtArticleStock1667720086123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_stock" ADD "visible" boolean NOT NULL DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "article_stock" DROP COLUMN "visible"`);
    }

}
