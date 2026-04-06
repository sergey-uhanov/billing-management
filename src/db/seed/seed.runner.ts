import {  Injectable } from '@nestjs/common';

import { UsersSeed } from './seeds/01-users.seed';
import { AccountsSeed } from './seeds/02-accounts.seed';
import { TransactionsSeed } from './seeds/03-transactions.seed';

export interface Seed {
  run(): Promise<void>;
}

@Injectable()
export class SeedRunner {
  constructor(
    private readonly usersSeed: UsersSeed,
    private readonly accountsSeed: AccountsSeed,
    private readonly transactionsSeed: TransactionsSeed
  ) {}

  async run() {
    await this.usersSeed.run();
    await this.accountsSeed.run();
    await this.transactionsSeed.run();
  }
}