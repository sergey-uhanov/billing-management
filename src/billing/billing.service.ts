import { Injectable } from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  Transaction,
  Transaction as TransactionEntity,
  TransactionStatus,
  TransactionType,
} from './entity/transaction.entity';

import Decimal from 'decimal.js';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Account } from '../account/entities/account.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class BillingService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService
  ) {}

  async sendWebHook(tx: Transaction) {
    console.log(process.env.WEBHOOK_URL);

    try {
      await firstValueFrom(
        this.httpService.post(process.env.WEBHOOK_URL!, {
          transactionId: tx.id,
          amount: tx.amount,
          type: tx.type,
        })
      );
    } catch (error) {
      console.error('Webhook failed', error);
    }
  }

  async transfer(
    fromId: number,
    toId: number,
    amount: string,
    externalId: string
  ) {
    const tx = await this.dataSource.transaction(async (manager) => {
      if (fromId === toId) {
        throw new Error('Cannot transfer to same account');
      }

      const existing = await manager.findOne(TransactionEntity, {
        where: { externalId },
      });
      if (existing) return existing;

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

    await this.sendWebHook(tx);
    return tx;
  }

  async deposit(accountId: number, amount: string) {
    const tx = await this.dataSource.transaction(async (manager) => {
      const account = await manager.findOneOrFail(Account, {
        where: { id: accountId },
        lock: { mode: 'pessimistic_write' },
      });

      const balance = new Decimal(account.balance);
      const transferAmount = new Decimal(amount);

      account.balance = balance.plus(transferAmount).toFixed(2);

      await manager.save(account);

      const tx = manager.create(TransactionEntity, {
        toAccount: account,
        amount: transferAmount.toFixed(2),
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.SUCCESS,
      });

      return manager.save(tx);
    });

    await this.sendWebHook(tx);
    return tx;
  }

  async cancelTransaction(txId: number) {
    const res = await this.dataSource.transaction(async (manager) => {
      const tx = await manager.findOneOrFail(TransactionEntity, {
        where: { id: txId },
        relations: ['fromAccount', 'toAccount'],
      });

      if (tx.status !== TransactionStatus.SUCCESS) {
        throw new Error('Cannot cancel');
      }
      if (tx.type === TransactionType.DEPOSIT) {
        throw new Error('Deposit cannot be canceled easily');
      }

      if (tx.type === TransactionType.TRANSFER) {
        const reversalTx = await this.transfer(
          tx.toAccount.id,
          tx.fromAccount.id,
          tx.amount,
          randomUUID()
        );

        await manager.update(
          TransactionEntity,
          { id: tx.id },
          { status: TransactionStatus.CANCELED }
        );

        return reversalTx;
      }
    });

    await this.sendWebHook(res!);
    return res;
  }
}
