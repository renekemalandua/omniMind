import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordDTO {
  @ApiProperty({
    required: true,
    description: 'id must be a string',
    example: '74929826-25e1-4025-b122-f64ead84fe0f',
  })
  @IsString()
  id: string;

  @ApiProperty({
    required: true,
    description: 'password',
    example: '********',
  })
  @IsString()
  lastPassword: string;

  @ApiProperty({
    required: true,
    description: 'password',
    example: '********',
  })
  @IsString()
  newPassword: string;
}
