import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1775462460820 implements MigrationInterface {
    name = 'Init1775462460820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."accounts_currency_enum" AS ENUM('USD')`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "balance" numeric(18,2) NOT NULL DEFAULT '0', "currency" "public"."accounts_currency_enum" NOT NULL DEFAULT 'USD', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('CLIENT', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "role" "public"."users_role_enum" array NOT NULL DEFAULT '{CLIENT}', "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELED')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "externalId" character varying NOT NULL, "amount" numeric(18,2) NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "from_account_id" integer, "to_account_id" integer, CONSTRAINT "UQ_c7677fa092ee0c2659fbf452920" UNIQUE ("externalId"), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_91ac87a22755563425b98ffc3c" ON "transactions" ("from_account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d81b9f7079880ed2c82d60a94b" ON "transactions" ("to_account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e744417ceb0b530285c08f3865" ON "transactions" ("createdAt") `);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "fk_accounts_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_91ac87a22755563425b98ffc3c0" FOREIGN KEY ("from_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_d81b9f7079880ed2c82d60a94b9" FOREIGN KEY ("to_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_d81b9f7079880ed2c82d60a94b9"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_91ac87a22755563425b98ffc3c0"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "fk_accounts_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e744417ceb0b530285c08f3865"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d81b9f7079880ed2c82d60a94b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91ac87a22755563425b98ffc3c"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TYPE "public"."accounts_currency_enum"`);
    }

}
