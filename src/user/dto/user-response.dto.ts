import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'Registered' })
  message: string;
}

export class UserFailedResponseDto {
  @ApiProperty({
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    example: 'User already exists',
  })
  message: string;

  @ApiProperty({
    example: 'Bad Request',
  })
  error: string;
}

export class GetUsersResponseDto {
  @ApiProperty({
    example: [
      {
        user_id: 1,
        email: 'admin@test.com',
        password: 'hashed',
        isActive: true,
        role: ['ADMIN'],
        refreshToken: null,
        createdAt: '2026-04-06T05:02:33.315Z',
        updatedAt: '2026-04-06T05:02:33.315Z',
      },
      {
        user_id: 2,
        email: 'user@test.com',
        password: 'hashed',
        isActive: true,
        role: ['CLIENT'],
        refreshToken: null,
        createdAt: '2026-04-06T05:02:33.391Z',
        updatedAt: '2026-04-06T05:02:33.391Z',
      },
    ],
  })
  message: string;
}
export class GetUserResponseDto {
  @ApiProperty({
    example: [
      {
        user_id: 1,
        email: 'admin@test.com',
        password: 'hashed',
        isActive: true,
        role: ['ADMIN'],
        refreshToken: null,
        createdAt: '2026-04-06T05:02:33.315Z',
        updatedAt: '2026-04-06T05:02:33.315Z',
      },
    ],
  })
  message: string;
}

export class UserDeleteResponseDto {
  @ApiProperty({ example: 'Deleted' })
  message: string;
}