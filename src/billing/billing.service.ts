import { Injectable } from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Transaction as TransactionEntity } from './entity/transaction.entity';
import { Account } from './entity/account.entity';
import Decimal from 'decimal.js';
import {
  TransactionStatus,
  TransactionType,
} from './entity/transaction.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {}

  async transfer(
    fromId: number,
    toId: number,
    amount: number,
    externalId: string
  ) {
    return this.dataSource.transaction(async (manager) => {
      if (fromId === toId) {
        throw new Error('Cannot transfer to same account');
      }

      const existing = await manager.findOne(TransactionEntity, {
        where: { externalId },
      });
      if (existing) return existing;

      // deterministic locking order
      const [firstId, secondId] = [fromId, toId].sort((a, b) => a - b);

      const accounts = await manager.find(Account, {
        where: [{ id: firstId }, { id: secondId }],
        lock: { mode: 'pessimistic_write' },
      });

      const from = accounts.find((a) => a.id === fromId);
      const to = accounts.find((a) => a.id === toId);

      if (!from || !to) throw new Error('Account not found');

      if (from.currency !== to.currency) {
        throw new Error('Currency mismatch');
      }

      const fromBalance = new Decimal(from.balance);
      const transferAmount = new Decimal(amount);

      if (fromBalance.lt(transferAmount)) {
        throw new Error('Insufficient funds');
      }


      const tx = manager.create(TransactionEntity, {
        fromAccount: from,
        toAccount: to,
        amount: transferAmount.toFixed(2),
        type: TransactionType.TRANSFER,
        status: TransactionStatus.PENDING,
        externalId,
      });

      await manager.save(tx);

      from.balance = fromBalance.minus(transferAmount).toFixed(2);
      to.balance = new Decimal(to.balance).plus(transferAmount).toFixed(2);

      await manager.save([from, to]);

      tx.status = TransactionStatus.SUCCESS;
      await manager.save(tx);

      return tx;
    });
  }
}
