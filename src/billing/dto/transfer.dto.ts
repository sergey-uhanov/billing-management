import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  fromId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  toId: number;

  @ApiProperty({
    example: '100.50',
    description: 'Сумма перевода (decimal строка)',
  })
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'amount must be a valid decimal with up to 2 decimal places',
  })
  amount: string;

  @ApiProperty({
    example: 'ext-123456',
    description: 'Идентификатор внешней транзакции',
  })
  @IsString()
  externalId: string;
}
