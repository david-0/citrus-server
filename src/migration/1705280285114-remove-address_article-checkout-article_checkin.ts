import {MigrationInterface, QueryRunner} from "typeorm";

export class schemaMigration1705280285114 implements MigrationInterface {
    name = 'removeAddressArticleCheckInAndArticleCheckOut1705280285114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "visible" SET DEFAULT 'false'`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "article_check_in"`);
        await queryRunner.query(`DROP TABLE "article_check_out"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "visible" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT false`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "name" character varying NOT NULL, "prename" character varying NOT NULL, "street" character varying NOT NULL, "number" character varying NOT NULL, "addition" character varying NOT NULL, "zipcode" character varying NOT NULL, "city" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_check_in" ("id" SERIAL NOT NULL, "quantity" numeric(10,1) NOT NULL, "plannedDate" TIMESTAMP NOT NULL, "comment" character varying NOT NULL, "done" boolean NOT NULL, "doneDate" TIMESTAMP, "articleStockId" integer, "doneUserId" integer, CONSTRAINT "PK_a9efd3d479aeab85757fdb16f21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_check_out" ("id" SERIAL NOT NULL, "quantity" numeric(10,1) NOT NULL, "plannedDate" TIMESTAMP NOT NULL, "comment" character varying NOT NULL, "done" boolean NOT NULL, "doneDate" TIMESTAMP, "articleStockId" integer, "doneUserId" integer, CONSTRAINT "PK_14b42c191e488cf9a2d7518919a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "article_check_out" ADD CONSTRAINT "FK_f3f02ae0e8f16ea85f88ac283fc" FOREIGN KEY ("articleStockId") REFERENCES "article_stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_check_out" ADD CONSTRAINT "FK_cb4cc6dc3d7197af94fd67c897f" FOREIGN KEY ("doneUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_check_in" ADD CONSTRAINT "FK_2dff00d3f36b4220118a9680bbf" FOREIGN KEY ("articleStockId") REFERENCES "article_stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_check_in" ADD CONSTRAINT "FK_20da6478fe3808ad5662ab1b7dd" FOREIGN KEY ("doneUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
