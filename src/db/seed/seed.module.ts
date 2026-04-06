import { Module } from '@nestjs/common';
import { SeedRunner } from './seed.runner';
import { UsersSeed } from './seeds/01-users.seed';
import { AccountsSeed } from './seeds/02-accounts.seed';
import { TransactionsSeed } from './seeds/03-transactions.seed';
import { UserModule } from '../../user/user.module';
import { BillingModule } from '../../billing/billing.module';

export const SEEDS = Symbol('SEEDS');

@Module({
  imports: [UserModule, BillingModule],
  providers: [UsersSeed, AccountsSeed, TransactionsSeed, SeedRunner],
  exports: [SeedRunner],
})
export class SeedModule {}
