import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '@auth/guargs/jwt.guard';
import { RolesGuard } from '@auth/guargs/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { ROLES } from '@common/constants/roles.constants';
import { CreateAccountDto } from './dto/create-account.dto';
import type { Request } from 'express';
import { User } from '../user/entities/user.entity';

@ApiTags('Account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.CLIENT)
  @Post()
  @ApiOperation({ summary: 'Create account' })
  @ApiResponse({ status: 201, description: 'Account created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createAccountDto: CreateAccountDto, @Req() req: Request) {
    const user = req.user as User;
    return this.accountService.create(createAccountDto, user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
