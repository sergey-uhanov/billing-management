import { Injectable } from '@nestjs/common';
import { Seed } from '../seed.runner';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../billing/entity/account.entity';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../../billing/entity/transaction.entity';

@Injectable()
export class TransactionsSeed implements Seed {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>
  ) {}

  async run() {
    const from = await this.accountRepo.findOne({
      where: { id: 1 },
    });

    const to = await this.accountRepo.findOne({
      where: { id: 2 },
    });

    if (!from || !to) return;

    const exists = await this.txRepo.findOne({
      where: { externalId: 'seed-tx-1' },
    });

    if (exists) return;

    await this.txRepo.save(
      this.txRepo.create({
        externalId: 'seed-tx-1',
        fromAccount: from,
        toAccount: to,
        amount: '50.00',
        type: TransactionType.TRANSFER,
        status: TransactionStatus.SUCCESS,
      })
    );
  }
}
