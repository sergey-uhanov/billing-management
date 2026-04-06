import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsPasswordsMatchingConstraint } from '../../../libs/common/src/decorators/is-passwords-matching-constraint.decorator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    minLength: 6,
    description: 'Пароль (минимум 6 символов)',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'strongPassword123',
    minLength: 6,
    description: 'Повтор пароля',
  })
  @IsString()
  @MinLength(6)
  @Validate(IsPasswordsMatchingConstraint)
  @IsNotEmpty()
  passwordRepeat: string;
}
