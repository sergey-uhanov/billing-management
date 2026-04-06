import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>
  ) {}

  findAll() {
    return this.repo.find();
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
