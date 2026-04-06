import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DepositDto {
  @ApiProperty({
    example: 1,
    description: 'ID аккаунта',
  })
  @IsNumber()
  accountId: number;

  @ApiProperty({
    example: '100.50',
    description: 'Сумма (строка для точности, decimal)',
  })
  @IsString()
  amount: string;
}
