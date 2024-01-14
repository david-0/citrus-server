import {MigrationInterface, QueryRunner} from "typeorm";

export class schemaMigration1705266221138 implements MigrationInterface {
    name = 'removeCheckedout1705266221138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_6419debfc7113c7a39b27463043"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" DROP CONSTRAINT "FK_f35e3fd7661fc77ac07fe00553e"`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" DROP CONSTRAINT "FK_0fd5dcdff770713ba4605af9347"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "checkedOut"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "checkedOutDate"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "checkingOutUserId"`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "visible" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" ADD CONSTRAINT "FK_0fd5dcdff770713ba4605af9347" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" ADD CONSTRAINT "FK_f35e3fd7661fc77ac07fe00553e" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" DROP CONSTRAINT "FK_f35e3fd7661fc77ac07fe00553e"`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" DROP CONSTRAINT "FK_0fd5dcdff770713ba4605af9347"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "visible" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "article_stock" ALTER COLUMN "soldOut" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "order" ADD "checkingOutUserId" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD "checkedOutDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order" ADD "checkedOut" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" ADD CONSTRAINT "FK_0fd5dcdff770713ba4605af9347" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" ADD CONSTRAINT "FK_f35e3fd7661fc77ac07fe00553e" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_6419debfc7113c7a39b27463043" FOREIGN KEY ("checkingOutUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
