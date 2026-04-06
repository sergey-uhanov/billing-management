import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '@auth/auth.service';
import { RegisterDto } from '@auth/dto/registerDto.dto';
import { LoginDto } from '@auth/dto/loginDto.dto';
import { Tokens } from '@auth/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.register(dto);

    this.setCookies(res, tokens);

    return { message: 'Registered' };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.login(dto);

    this.setCookies(res, tokens);

    return { message: 'Logged in' };
  }

  private setCookies(res: Response, tokens: Tokens) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
