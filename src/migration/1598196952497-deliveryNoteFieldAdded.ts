import {MigrationInterface, QueryRunner} from "typeorm";

export class deliveryNoteFieldAdded1598196952497 implements MigrationInterface {
    name = 'deliveryNoteFieldAdded1598196952497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryNoteCreated" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryNoteCreated"`);
    }

}
