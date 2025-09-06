import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDTO 
{
  @ApiProperty({
    required: true,
    description: 'email is required',
    example: 'example@gmail.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    description: 'phone number is required',
    example: '923000111',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    required: true,
    description: 'password',
    example: '********',
  })
  @IsString()
  @IsStrongPassword()
  password: string;
}
