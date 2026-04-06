import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Account } from './entity/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService, TypeOrmModule],
})
export class BillingModule {}
