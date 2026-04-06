import { MigrationInterface, QueryRunner } from "typeorm";

export class UdateTransactionSchema1775374712284 implements MigrationInterface {
    name = 'UdateTransactionSchema1775374712284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_01dd895f76e72d570de54d84e2a"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_4e3a0a2c3c335671543aa960642"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_0b21fbaa4a042efac978a5252cf"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "fromAccountId"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "toAccountId"`);
        await queryRunner.query(`CREATE TYPE "public"."accounts_currency_enum" AS ENUM('USD')`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "currency" "public"."accounts_currency_enum" NOT NULL DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "externalId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "UQ_c7677fa092ee0c2659fbf452920" UNIQUE ("externalId")`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "from_account_id" integer`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "to_account_id" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_91ac87a22755563425b98ffc3c" ON "transactions" ("from_account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d81b9f7079880ed2c82d60a94b" ON "transactions" ("to_account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e744417ceb0b530285c08f3865" ON "transactions" ("createdAt") `);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_01dd895f76e72d570de54d84e2a" FOREIGN KEY ("userUserId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_91ac87a22755563425b98ffc3c0" FOREIGN KEY ("from_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_d81b9f7079880ed2c82d60a94b9" FOREIGN KEY ("to_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_d81b9f7079880ed2c82d60a94b9"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_91ac87a22755563425b98ffc3c0"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_01dd895f76e72d570de54d84e2a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e744417ceb0b530285c08f3865"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d81b9f7079880ed2c82d60a94b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91ac87a22755563425b98ffc3c"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "to_account_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "from_account_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "UQ_c7677fa092ee0c2659fbf452920"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "externalId"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "currency"`);
        await queryRunner.query(`DROP TYPE "public"."accounts_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "toAccountId" integer`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "fromAccountId" integer`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_0b21fbaa4a042efac978a5252cf" FOREIGN KEY ("toAccountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_4e3a0a2c3c335671543aa960642" FOREIGN KEY ("fromAccountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_01dd895f76e72d570de54d84e2a" FOREIGN KEY ("userUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
