import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '@auth/auth.service';
import { RegisterDto } from '@auth/dto/registerDto.dto';
import { LoginDto } from '@auth/dto/loginDto.dto';
import { Tokens } from '@auth/interfaces';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.register(dto);
    this.setCookies(res, tokens);

    return { message: 'Registered' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.login(dto);
    this.setCookies(res, tokens);

    return { message: 'Logged in' };
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, description: 'Token refresh successfully.' })
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res);
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
