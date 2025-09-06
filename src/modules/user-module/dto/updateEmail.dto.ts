import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateEmailDTO {
  @ApiProperty({
    required: true,
    description: 'id must be a string',
    example: '74929826-25e1-4025-b122-f64ead84fe0f',
  })
  @IsString()
  id: string;

  @ApiProperty({
    required: true,
    description: 'email must be a string',
    example: 'test@gmail.com',
  })
  @IsEmail()
  newEmail: string;
}
