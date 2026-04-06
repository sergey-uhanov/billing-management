import { UserService } from '../user/user.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '@auth/dto/registerDto.dto';
import { User } from '../user/entities/user.entity';
import * as argon2 from 'argon2';
import { ROLES } from '@common/constants/roles.constants';
import { LoginDto } from '@auth/dto/loginDto.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const exist = await this.userService.findByEmail(dto.email);
    if (exist) throw new BadRequestException('User already exists');

    const hash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const user = await this.userService.create({
      ...dto,
      password: hash,
      role: [ROLES.CLIENT],
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException();

    const isValid = await argon2.verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException();

    if (!user.isActive) {
      throw new ForbiddenException('User deactivated');
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.user_id,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const hashedRefresh = await argon2.hash(refreshToken, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    await this.userService.updateRefreshToken(user.user_id, hashedRefresh);

    return {
      accessToken,
      refreshToken,
    };
  }
}
