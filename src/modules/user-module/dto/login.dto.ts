import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthLoginDTO {
  @ApiProperty({
    required: true,
    description: 'email',
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'password',
    example: '********',
  })
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
    description: 'platform',
    example: 'kima-app',
  })
  @IsString()
  platform: string;
}
