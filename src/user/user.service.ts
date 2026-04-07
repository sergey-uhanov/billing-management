import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>
  ) {}

  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;

    const [users, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        user_id: 'ASC',
      },
    });

    return {
      data: users,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { user_id: id },
    });
  }

  create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  update(id: number, data: Partial<User>) {
    return this.repo.update(id, data);
  }

  updateRefreshToken(userId: number, token: string) {
    return this.repo.update(userId, {
      refreshToken: token,
    });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
