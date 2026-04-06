import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Currency } from '../entities/account.entity';

export class CreateAccountDto {
  @ApiProperty({
    enum: Currency,
    example: Currency.USD,
    description: 'Валюта аккаунта',
  })
  @IsEnum(Currency)
  currency: Currency;
}
