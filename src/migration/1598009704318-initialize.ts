import {MigrationInterface, QueryRunner} from "typeorm";

export class initialize1598009704318 implements MigrationInterface {
    name = 'initialize1598009704318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "opening_hour" ("id" SERIAL NOT NULL, "fromDate" TIMESTAMP NOT NULL, "toDate" TIMESTAMP NOT NULL, "locationId" integer, CONSTRAINT "PK_6551ceb95c04da8afd85da470c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "street" character varying NOT NULL, "number" character varying NOT NULL, "addition" character varying NOT NULL, "zipcode" character varying NOT NULL, "city" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "name" character varying NOT NULL, "prename" character varying NOT NULL, "street" character varying NOT NULL, "number" character varying NOT NULL, "addition" character varying NOT NULL, "zipcode" character varying NOT NULL, "city" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_check_out" ("id" SERIAL NOT NULL, "quantity" numeric(10,1) NOT NULL, "plannedDate" TIMESTAMP NOT NULL, "comment" character varying NOT NULL, "done" boolean NOT NULL, "doneDate" TIMESTAMP, "articleStockId" integer, "doneUserId" integer, CONSTRAINT "PK_14b42c191e488cf9a2d7518919a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "sendDate" TIMESTAMP NOT NULL, "subject" character varying NOT NULL, "content" character varying NOT NULL, "responses" character varying NOT NULL, "sendUserId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reset_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "validTo" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_93e1171b4a87d2d0478295f1a99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_audit" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "action" character varying NOT NULL, "actionResult" character varying NOT NULL, "additionalData" character varying, "ip" character varying NOT NULL, "userAgent" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_028d1949aea3ccc867e56bd4bb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "name" character varying NOT NULL, "prename" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "comment" character varying NOT NULL DEFAULT '', "totalPrice" numeric(10,2) NOT NULL, "checkedOut" boolean NOT NULL, "checkedOutDate" TIMESTAMP, "locationId" integer, "userId" integer, "plannedCheckoutId" integer, "checkingOutUserId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "copiedPrice" numeric(10,2) NOT NULL, "quantity" numeric(10,1) NOT NULL, "orderId" integer, "articleId" integer, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "unit_of_measurement" ("id" SERIAL NOT NULL, "shortcut" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_44349d16c109aa8ac1ee2726d5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "number" integer NOT NULL, "description" character varying NOT NULL, "imageId" character varying, "price" numeric(10,2) NOT NULL, "inSale" boolean NOT NULL, "saleUnit" numeric(10,1) NOT NULL DEFAULT 1, "unitOfMeasurementId" integer, CONSTRAINT "UQ_bdd4fd5c666442eed7626de4979" UNIQUE ("number"), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_stock" ("id" SERIAL NOT NULL, "quantity" numeric(10,1) NOT NULL, "reservedQuantity" numeric(10,1) NOT NULL, "soldOut" boolean NOT NULL DEFAULT 'false', "articleId" integer, "locationId" integer, CONSTRAINT "UQ_d9e1863b7811526bbcdc4abd656" UNIQUE ("articleId", "locationId"), CONSTRAINT "PK_71fcc9a84894e8451bab81fa08d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_check_in" ("id" SERIAL NOT NULL, "quantity" numeric(10,1) NOT NULL, "plannedDate" TIMESTAMP NOT NULL, "comment" character varying NOT NULL, "done" boolean NOT NULL, "doneDate" TIMESTAMP, "articleStockId" integer, "doneUserId" integer, CONSTRAINT "PK_a9efd3d479aeab85757fdb16f21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "contentType" character varying NOT NULL, "image" bytea NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_archive" ("id" SERIAL NOT NULL, "archiveDate" TIMESTAMP NOT NULL, "archiveUser" character varying NOT NULL, "order" character varying NOT NULL, CONSTRAINT "PK_491bde32884fac532840cba9853" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_not_confirmed" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "name" character varying NOT NULL, "prename" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "validTo" TIMESTAMP NOT NULL, CONSTRAINT "UQ_526f8f3a34d9b8005f79b11a281" UNIQUE ("email"), CONSTRAINT "PK_e1344da7724dd995701776634da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "user_received_messages_message" ("userId" integer NOT NULL, "messageId" integer NOT NULL, CONSTRAINT "PK_065fc06c11a2332db61606b6f06" PRIMARY KEY ("userId", "messageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0fd5dcdff770713ba4605af934" ON "user_received_messages_message" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f35e3fd7661fc77ac07fe00553" ON "user_received_messages_message" ("messageId") `);
        await queryRunner.query(`ALTER TABLE "opening_hour" ADD CONSTRAINT "FK_51092b2a57822a2bc12c4f5a62f" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_check_out" ADD CONSTRAINT "FK_f3f02ae0e8f16ea85f88ac283fc" FOREIGN KEY ("articleStockId") REFERENCES "article_stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_check_out" ADD CONSTRAINT "FK_cb4cc6dc3d7197af94fd67c897f" FOREIGN KEY ("doneUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_e53b10d7ff28a4c1dd5683dd741" FOREIGN KEY ("sendUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reset_token" ADD CONSTRAINT "FK_1d61419c157e5325204cbee7a28" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_audit" ADD CONSTRAINT "FK_cbcf47ce8f65b440c11aeecf915" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_d8e60777de8c68a2107831d16fa" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_a72b948a8988af12582ba1c3a33" FOREIGN KEY ("plannedCheckoutId") REFERENCES "opening_hour"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_6419debfc7113c7a39b27463043" FOREIGN KEY ("checkingOutUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_deed27a2828c6d9508fb58baa62" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_08fff032b835fa15811144cfbb9" FOREIGN KEY ("unitOfMeasurementId") REFERENCES "unit_of_measurement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_stock" ADD CONSTRAINT "FK_6197441ac29620f41a6f635a92f" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_stock" ADD CONSTRAINT "FK_c6356b561474e230c7438ad461d" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_check_in" ADD CONSTRAINT "FK_2dff00d3f36b4220118a9680bbf" FOREIGN KEY ("articleStockId") REFERENCES "article_stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_check_in" ADD CONSTRAINT "FK_20da6478fe3808ad5662ab1b7dd" FOREIGN KEY ("doneUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" ADD CONSTRAINT "FK_0fd5dcdff770713ba4605af9347" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" ADD CONSTRAINT "FK_f35e3fd7661fc77ac07fe00553e" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" DROP CONSTRAINT "FK_f35e3fd7661fc77ac07fe00553e"`);
        await queryRunner.query(`ALTER TABLE "user_received_messages_message" DROP CONSTRAINT "FK_0fd5dcdff770713ba4605af9347"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
        await queryRunner.query(`ALTER TABLE "article_check_in" DROP CONSTRAINT "FK_20da6478fe3808ad5662ab1b7dd"`);
        await queryRunner.query(`ALTER TABLE "article_check_in" DROP CONSTRAINT "FK_2dff00d3f36b4220118a9680bbf"`);
        await queryRunner.query(`ALTER TABLE "article_stock" DROP CONSTRAINT "FK_c6356b561474e230c7438ad461d"`);
        await queryRunner.query(`ALTER TABLE "article_stock" DROP CONSTRAINT "FK_6197441ac29620f41a6f635a92f"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_08fff032b835fa15811144cfbb9"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_deed27a2828c6d9508fb58baa62"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_6419debfc7113c7a39b27463043"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_a72b948a8988af12582ba1c3a33"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_d8e60777de8c68a2107831d16fa"`);
        await queryRunner.query(`ALTER TABLE "user_audit" DROP CONSTRAINT "FK_cbcf47ce8f65b440c11aeecf915"`);
        await queryRunner.query(`ALTER TABLE "reset_token" DROP CONSTRAINT "FK_1d61419c157e5325204cbee7a28"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_e53b10d7ff28a4c1dd5683dd741"`);
        await queryRunner.query(`ALTER TABLE "article_check_out" DROP CONSTRAINT "FK_cb4cc6dc3d7197af94fd67c897f"`);
        await queryRunner.query(`ALTER TABLE "article_check_out" DROP CONSTRAINT "FK_f3f02ae0e8f16ea85f88ac283fc"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`);
        await queryRunner.query(`ALTER TABLE "opening_hour" DROP CONSTRAINT "FK_51092b2a57822a2bc12c4f5a62f"`);
        await queryRunner.query(`DROP INDEX "IDX_f35e3fd7661fc77ac07fe00553"`);
        await queryRunner.query(`DROP INDEX "IDX_0fd5dcdff770713ba4605af934"`);
        await queryRunner.query(`DROP TABLE "user_received_messages_message"`);
        await queryRunner.query(`DROP INDEX "IDX_4be2f7adf862634f5f803d246b"`);
        await queryRunner.query(`DROP INDEX "IDX_5f9286e6c25594c6b88c108db7"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`DROP TABLE "user_not_confirmed"`);
        await queryRunner.query(`DROP TABLE "order_archive"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "article_check_in"`);
        await queryRunner.query(`DROP TABLE "article_stock"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TABLE "unit_of_measurement"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_audit"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "reset_token"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "article_check_out"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "opening_hour"`);
    }

}
