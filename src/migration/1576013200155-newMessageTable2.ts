import {MigrationInterface, QueryRunner} from "typeorm";

export class NewMessageTable21576013200155 implements MigrationInterface {
  public name = "newMessageTable21576013200155";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "sendDate" TIMESTAMP NOT NULL, "subject" character varying NOT NULL, "content" character varying NOT NULL, "responses" character varying NOT NULL, "sendUserId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`, undefined);
    await queryRunner.query(`CREATE TABLE "user_received_messages_message" ("userId" integer NOT NULL, "messageId" integer NOT NULL, CONSTRAINT "PK_065fc06c11a2332db61606b6f06" PRIMARY KEY ("userId", "messageId"))`, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_0fd5dcdff770713ba4605af934" ON "user_received_messages_message" ("userId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_f35e3fd7661fc77ac07fe00553" ON "user_received_messages_message" ("messageId") `, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT 'false'`, undefined);
    await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_e53b10d7ff28a4c1dd5683dd741" FOREIGN KEY ("sendUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "user_received_messages_message" ADD CONSTRAINT "FK_0fd5dcdff770713ba4605af9347" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "user_received_messages_message" ADD CONSTRAINT "FK_f35e3fd7661fc77ac07fe00553e" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_received_messages_message" DROP CONSTRAINT "FK_f35e3fd7661fc77ac07fe00553e"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_received_messages_message" DROP CONSTRAINT "FK_0fd5dcdff770713ba4605af9347"`, undefined);
    await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_e53b10d7ff28a4c1dd5683dd741"`, undefined);
    await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT false`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_f35e3fd7661fc77ac07fe00553"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_0fd5dcdff770713ba4605af934"`, undefined);
    await queryRunner.query(`DROP TABLE "user_received_messages_message"`, undefined);
    await queryRunner.query(`DROP TABLE "message"`, undefined);
  }

}
