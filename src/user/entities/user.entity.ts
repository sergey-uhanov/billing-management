import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Role } from '@common/constants/roles.constants';
import { ROLES } from '@common/constants/roles.constants';
import { Account } from '../../billing/entity/account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ROLES,
    array: true,
    default: [ROLES.CLIENT],
  })
  role: Role[];

  @Column({ nullable: true, select: false })
  refreshToken: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
