import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { TransferDto } from './dto/transfer.dto';
import { DepositDto } from './dto/deposit.dto';
import { JwtAuthGuard } from '@auth/guargs/jwt.guard';
import { RolesGuard } from '@auth/guargs/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { ROLES } from '@common/constants/roles.constants';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Billing')
@ApiBearerAuth()
@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('transfer')
  @Roles(ROLES.CLIENT)
  @ApiOperation({ summary: 'Transferring funds between accounts' })
  @ApiResponse({ status: 200, description: 'Transfer successfully.' })
  @ApiResponse({ status: 400, description: 'Error transfering funds.' })
  async transfer(@Body() dto: TransferDto) {
    const tx = await this.billingService.transfer(
      dto.fromId,
      dto.toId,
      dto.amount,
      dto.externalId
    );

    await this.billingService.sendWebHook(tx);

    return tx;
  }

  @Post('deposit')
  @Roles(ROLES.CLIENT)
  @ApiOperation({ summary: 'Deposit' })
  @ApiResponse({ status: 200, description: 'Deposit successfully.' })
  async deposit(@Body() dto: DepositDto) {
    const tx = await this.billingService.deposit(dto.accountId, dto.amount);

    await this.billingService.sendWebHook(tx);

    return tx;
  }

  @Post('cancel/:id')
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Cancel transaction (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Transaction canceled' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.cancelTransaction(id);
  }
}