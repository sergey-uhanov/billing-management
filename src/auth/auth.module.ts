import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { options } from '@auth/config/jwt-module-async-options';
import { JwtStrategy } from '@auth/strategy/jwt.strategy';
import { RolesGuard } from '@auth/guargs/roles.guard';
import { AccountModule } from '../account/account.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  imports: [JwtModule.registerAsync(options()), UserModule, AccountModule],
})
export class AuthModule {}
