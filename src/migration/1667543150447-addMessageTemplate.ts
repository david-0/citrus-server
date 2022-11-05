import {MigrationInterface, QueryRunner} from "typeorm";

export class addMessageTemplate1667543150447 implements MigrationInterface {
    name = 'addMessageTemplate1667543150447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message_template" ("id" SERIAL NOT NULL, "subject" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_616800da109c721fb4dd2019a9b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "message_template"`);
    }
}
