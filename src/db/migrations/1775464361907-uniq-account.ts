import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqAccount1775464361907 implements MigrationInterface {
    name = 'UniqAccount1775464361907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "uq_user_currency" UNIQUE ("user_id", "currency")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "uq_user_currency"`);
    }

}
