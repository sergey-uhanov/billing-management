import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
