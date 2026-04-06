import { Injectable } from '@nestjs/common';
import { Seed } from '../seed.runner';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { Account, Currency } from '../../../account/entities/account.entity';

@Injectable()
export class AccountsSeed implements Seed {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async run() {
    const users = ['user@test.com', 'admin@test.com'];

    for (const userItem of users) {
      const user = await this.userRepo.findOne({
        where: { email: userItem },
      });

      if (!user) return;

      const exists = await this.accountRepo.findOne({
        where: { user: { user_id: user.user_id } },
      });

      if (exists) return;

      await this.accountRepo.save(
        this.accountRepo.create({
          user,
          balance: '1000.00',
          currency: Currency.USD,
        })
      );
    }
  }
}
