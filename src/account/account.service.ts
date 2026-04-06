import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private repo: Repository<Account>
  ) {}
  async create(createAccountDto: CreateAccountDto, id: number) {
    const account = this.repo.create({
      currency: createAccountDto.currency,
      id: id,
    });

    return await this.repo.save(account);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
