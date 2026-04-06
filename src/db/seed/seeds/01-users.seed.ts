import { Seed } from '../seed.runner';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ROLES } from '@common/constants/roles.constants';

@Injectable()
export class UsersSeed implements Seed {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async run() {
    const users = [
      {
        email: 'admin@test.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=1$9ye8B7XGmjF4Py5DzkNQqQ$6P0al0QC5Rmqdg4drqYkpxQMlPwQ1vCxfki/b5hMIiw',
        role: [ROLES.ADMIN, ROLES.CLIENT],
      },
      {
        email: 'user@test.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=1$9ye8B7XGmjF4Py5DzkNQqQ$6P0al0QC5Rmqdg4drqYkpxQMlPwQ1vCxfki/b5hMIiw',
        role: [ROLES.CLIENT],
      },
    ];

    for (const u of users) {
      const exists = await this.userRepo.findOne({
        where: { email: u.email },
      });

      if (exists) continue;

      await this.userRepo.save(this.userRepo.create(u));
    }
  }
}
